import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Answers certification-ranking questions. A requirement for EMT is met by an
 * EMT, or by anything that outranks it — AEMT, Paramedic — following the
 * hierarchy transitively.
 *
 * Deliberately the same shape as CredentialGraphService: one cached graph,
 * built from the stored edges, with a cycle guard so a hierarchy an
 * administrator mis-wires cannot hang a request.
 */
@Injectable()
export class CertificationGraphService {
  private cache?: {
    at: number;
    /** typeId -> ids that satisfy it (itself + everything above). */
    satisfiedBy: Map<number, Set<number>>;
  };

  constructor(private readonly prisma: PrismaService) {}

  private async graph() {
    if (this.cache && Date.now() - this.cache.at < 60_000) return this.cache;

    const [types, edges] = await Promise.all([
      this.prisma.certificationType.findMany({ select: { id: true } }),
      this.prisma.certificationSupersession.findMany(),
    ]);

    // higher -> the ones it directly outranks
    const outranks = new Map<number, number[]>();
    for (const edge of edges) {
      outranks.set(edge.higherTypeId, [
        ...(outranks.get(edge.higherTypeId) ?? []),
        edge.lowerTypeId,
      ]);
    }

    const below = new Map<number, Set<number>>();
    const resolve = (id: number): Set<number> => {
      const memo = below.get(id);
      if (memo) return memo;
      const out = new Set<number>();
      below.set(id, out); // placeholder guards against a cycle
      for (const lower of outranks.get(id) ?? []) {
        out.add(lower);
        for (const deeper of resolve(lower)) out.add(deeper);
      }
      return out;
    };

    const satisfiedBy = new Map<number, Set<number>>();
    for (const type of types) satisfiedBy.set(type.id, new Set([type.id]));
    for (const type of types) {
      for (const lower of resolve(type.id)) {
        satisfiedBy.get(lower)?.add(type.id);
      }
    }

    this.cache = { at: Date.now(), satisfiedBy };
    return this.cache;
  }

  /** Type ids that satisfy `requiredTypeId`, itself included. */
  async satisfying(requiredTypeId: number): Promise<number[]> {
    const { satisfiedBy } = await this.graph();
    return [...(satisfiedBy.get(requiredTypeId) ?? new Set([requiredTypeId]))];
  }

  /** Drop the cache after an edit so the next read sees the new hierarchy. */
  invalidate(): void {
    this.cache = undefined;
  }
}
