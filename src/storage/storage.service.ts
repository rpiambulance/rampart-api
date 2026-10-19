import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export interface StoredObject {
  body: Buffer;
  contentType: string;
}

/**
 * Object storage behind STORAGE_DRIVER=local|s3. Local writes under
 * STORAGE_LOCAL_PATH (a mounted volume in production); S3 targets any
 * S3-compatible endpoint. Swapping drivers is config-only (spec §11).
 */
@Injectable()
export class StorageService {
  private readonly driver: 'local' | 's3';
  private readonly localPath: string;
  private s3?: S3Client;
  private bucket?: string;

  constructor(private readonly config: ConfigService) {
    this.driver = config.get('STORAGE_DRIVER') === 's3' ? 's3' : 'local';
    this.localPath = config.get('STORAGE_LOCAL_PATH') ?? './storage';
    if (this.driver === 's3') {
      this.bucket = config.getOrThrow('S3_BUCKET');
      this.s3 = new S3Client({
        endpoint: config.get('S3_ENDPOINT'),
        region: config.get('S3_REGION') ?? 'us-east-1',
        forcePathStyle: !!config.get('S3_ENDPOINT'),
        credentials: {
          accessKeyId: config.getOrThrow('S3_ACCESS_KEY_ID'),
          secretAccessKey: config.getOrThrow('S3_SECRET_ACCESS_KEY'),
        },
      });
    }
  }

  newKey(prefix: string, fileName: string): string {
    const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${prefix}/${randomBytes(8).toString('hex')}-${safe}`;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    if (this.driver === 's3') {
      await this.s3!.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
      return;
    }
    const path = join(this.localPath, key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body);
    await writeFile(`${path}.meta`, contentType);
  }

  async get(key: string): Promise<StoredObject> {
    if (this.driver === 's3') {
      const res = await this.s3!.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return {
        body: Buffer.from(await res.Body!.transformToByteArray()),
        contentType: res.ContentType ?? 'application/octet-stream',
      };
    }
    const path = join(this.localPath, key);
    const [body, contentType] = await Promise.all([
      readFile(path),
      readFile(`${path}.meta`, 'utf8').catch(
        () => 'application/octet-stream',
      ),
    ]);
    return { body, contentType };
  }

  async delete(key: string): Promise<void> {
    if (this.driver === 's3') {
      await this.s3!.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return;
    }
    const path = join(this.localPath, key);
    await rm(path, { force: true });
    await rm(`${path}.meta`, { force: true });
  }
}
