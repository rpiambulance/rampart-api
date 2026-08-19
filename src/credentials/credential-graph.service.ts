import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Answers credential-ladder questions. "Satisfies X" means: holds X, or holds
 * any credential whose prerequisite chain (transitively) includes X — i.e.
 * "X or above". Example: a CC satisfies P-CC, A-CC, A, and O.
 *
 * A credential flagged `outranksAll` satisfies everything, whether or not it
 * descends from the requirement. Duty Supervisor is the case that matters: it
 * requires CC-T, D-T and EES, so the graph alone would not have it satisfy the
 * FR-CC add-on, which sits outside that chain.
 */
@Injectable()
export class CredentialGraphService {
  private cache?: {
    at: number;
    // typeKey -> set of type keys that satisfy it (itself + all descendants)
    satisfiedBy: Map<string, Set<string>>;
    /** Keys flagged outranksAll. */
    outranking: Set<string>;
    idToKey: Map<number, string>;
    keyToId: Map<string, number>;
  };

  constructor(private readonly prisma: PrismaService) {}

  private async graph() {
    if (this.cache && Date.now() - this.cache.at < 60_000) return this.cache;

    const types = await this.prisma.credentialType.findMany({
      include: { prerequisites: true },
    });
    const idToKey = new Map(types.map((t) => [t.id, t.key]));
    const keyToId = new Map(types.map((t) => [t.key, t.id]));

    // parents[key] = keys it directly requires
    const parents = new Map<string, string[]>();
    for (const t of types) {
      parents.set(
        t.key,
        t.prerequisites.map((p) => idToKey.get(p.requiresTypeId)!),
      );
    }

    // ancestors via DFS with memo
    const ancestorsOf = new Map<string, Set<string>>();
    const resolve = (key: string): Set<string> => {
      const memo = ancestorsOf.get(key);
      if (memo) return memo;
      const out = new Set<string>();
      ancestorsOf.set(key, out); // placeholder guards against cycles
      for (const parent of parents.get(key) ?? []) {
        out.add(parent);
        for (const a of resolve(parent)) out.add(a);
      }
      return out;
    };

    const satisfiedBy = new Map<string, Set<string>>();
    for (const t of types) satisfiedBy.set(t.key, new Set([t.key]));
    for (const t of types) {
      for (const ancestor of resolve(t.key)) {
        satisfiedBy.get(ancestor)?.add(t.key);
      }
    }
    // Supervisory credentials satisfy every requirement, including add-ons
    // they do not descend from.
    const outranking = new Set<string>();
    for (const t of types.filter((type) => type.outranksAll)) {
      outranking.add(t.key);
      for (const satisfying of satisfiedBy.values()) satisfying.add(t.key);
    }

    this.cache = { at: Date.now(), satisfiedBy, outranking, idToKey, keyToId };
    return this.cache;
  }

  /** Does this set of ACTIVE credential keys satisfy `requiredKey` ("or above")? */
  async satisfies(
    heldKeys: Set<string>,
    requiredKey: string,
  ): Promise<boolean> {
    const { satisfiedBy } = await this.graph();
    const satisfying = satisfiedBy.get(requiredKey);
    if (!satisfying) return false;
    for (const key of heldKeys) if (satisfying.has(key)) return true;
    return false;
  }

  /** Does the set include a credential that outranks the whole ladder (DS)? */
  async outranksEverything(heldKeys: Set<string>): Promise<boolean> {
    const { outranking } = await this.graph();
    for (const key of heldKeys) if (outranking.has(key)) return true;
    return false;
  }

  /** Does the set hold `key` exactly (not "or above")? */
  holdsExactly(heldKeys: Set<string>, key: string): boolean {
    return heldKeys.has(key);
  }

  /** Active credential keys for a member. */
  async heldKeys(memberId: number): Promise<Set<string>> {
    const creds = await this.prisma.memberCredential.findMany({
      where: { memberId, status: 'ACTIVE' },
      include: { type: { select: { key: true } } },
    });
    return new Set(creds.map((c) => c.type.key));
  }

  async typeIdForKey(key: string): Promise<number | undefined> {
    const { keyToId } = await this.graph();
    return keyToId.get(key);
  }
}
