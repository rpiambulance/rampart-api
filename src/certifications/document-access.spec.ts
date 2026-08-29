import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import type { AuthContext } from '../auth/auth-context';
import { PERMISSIONS } from '../permissions/catalog';

/**
 * Who may open a certification document. The rule spans two ideas that no
 * single permission expresses — it is your own record, or you review these —
 * so it is worth pinning down without a database in the way.
 */
function serviceFor(doc: unknown) {
  const prisma = {
    certificationDocument: { findUnique: () => Promise.resolve(doc) },
  };
  const storage = {
    get: () =>
      Promise.resolve({
        body: Buffer.from('pdf'),
        contentType: 'application/pdf',
      }),
  };
  return new CertificationsService(
    {} as never,
    { idsBelow: () => Promise.resolve([]) } as never,
    prisma as never,
    storage as never,
    {} as never,
    {} as never,
  );
}

function member(id: number, ...permissions: string[]): AuthContext {
  return {
    kind: 'member',
    memberId: id,
    permissions: new Set(permissions),
  };
}

const DOC = {
  id: 'e5b1c0a6-0000-4000-8000-000000000001',
  storageKey: 'certs/abc-card.pdf',
  fileName: 'card.pdf',
  certification: { memberId: 7 },
};

describe('certification document access', () => {
  it('lets a member open a document on their own record', async () => {
    const { doc } = await serviceFor(DOC).getDocument(DOC.id, member(7));
    expect(doc.fileName).toBe('card.pdf');
  });

  it('refuses somebody else with no standing', async () => {
    await expect(
      serviceFor(DOC).getDocument(DOC.id, member(8)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('lets a verifier open anyone’s', async () => {
    const { doc } = await serviceFor(DOC).getDocument(
      DOC.id,
      member(8, PERMISSIONS.CERTS_VERIFY),
    );
    expect(doc.fileName).toBe('card.pdf');
  });

  it('lets someone who may read every record open one too', async () => {
    // Reading a certification and being unable to see what it was proved with
    // is the same gap in a different place.
    const { doc } = await serviceFor(DOC).getDocument(
      DOC.id,
      member(8, PERMISSIONS.CERTS_READ_ALL),
    );
    expect(doc.fileName).toBe('card.pdf');
  });

  it('refuses an API token holding neither permission', async () => {
    const token = {
      kind: 'api-token',
      apiTokenId: 3,
      permissions: new Set<string>(),
    } as unknown as AuthContext;
    await expect(
      serviceFor(DOC).getDocument(DOC.id, token),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('says not found for an id that matches nothing', async () => {
    await expect(
      serviceFor(null).getDocument('nope', member(7, PERMISSIONS.CERTS_VERIFY)),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
