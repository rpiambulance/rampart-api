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
    /** key -> the credentials beneath it on the ladder, transitively. */
    below: Map<string, Set<string>>;
    /** Keys flagged outranksAll. */
    outranking: Set<string>;
    idToKey: Map<number, string>;
    keyToId: Map<string, number>;
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Forget the cached ladder.
   *
   * The ladder itself is seeded at boot and does not change while the app
   * runs, so this exists for whatever does change it — a migration, a
   * fixture — rather than being called on every write. Which roles a
   * credential confers is read live and is not cached at all.
   */
  invalidate(): void {
    this.cache = undefined;
  }

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

    // The rungs below each credential: what it directly requires, and what
    // those require, all the way down.
    const below = new Map<string, Set<string>>();
    for (const t of types) below.set(t.key, new Set(resolve(t.key)));

    this.cache = {
      at: Date.now(),
      satisfiedBy,
      outranking,
      idToKey,
      keyToId,
      below,
    };
    return this.cache;
  }

  /**
   * The credential type ids beneath this one on the ladder.
   *
   * Used to inherit certification requirements downward: holding a rung means
   * still holding what every rung under it demanded. Written on each rung
   * separately, the day somebody adds a certification to Attendant is the day
   * every credential above it quietly stops requiring it.
   */
  async idsBelow(credentialTypeId: number): Promise<number[]> {
    const { idToKey, keyToId, below } = await this.graph();
    const key = idToKey.get(credentialTypeId);
    if (!key) return [];
    return [...(below.get(key) ?? [])]
      .map((k) => keyToId.get(k))
      .filter((id): id is number => id !== undefined);
  }

  /** This credential and everything beneath it, for requirement lookups. */
  async idsAtOrBelow(credentialTypeId: number): Promise<number[]> {
    return [credentialTypeId, ...(await this.idsBelow(credentialTypeId))];
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

  /**
   * Everything a set of held credentials satisfies, itself included.
   *
   * The same "or above" the requirement checks use, asked the other way
   * round. A Crew Chief satisfies P-CC, A-CC, A and O whether or not those
   * rows were ever written — an admin-granted or legacy-imported credential
   * often has only the top rung — and a Duty Supervisor satisfies the lot.
   */
  async keysSatisfiedBy(heldKeys: Set<string>): Promise<Set<string>> {
    const { satisfiedBy } = await this.graph();
    const out = new Set<string>();
    for (const [required, satisfying] of satisfiedBy) {
      for (const held of heldKeys) {
        if (satisfying.has(held)) {
          out.add(required);
          break;
        }
      }
    }
    return out;
  }

  /**
   * The other direction: every credential that would satisfy one of these.
   *
   * For asking "who holds this?" rather than "does this person hold it?".
   */
  async keysSatisfying(requiredKeys: Iterable<string>): Promise<Set<string>> {
    const { satisfiedBy } = await this.graph();
    const out = new Set<string>();
    for (const required of requiredKeys) {
      for (const key of satisfiedBy.get(required) ?? []) out.add(key);
    }
    return out;
  }

  /**
   * The topmost of these credentials: the one nothing else here is above.
   *
   * A member holding the whole chain is a Duty Supervisor, not an Observer
   * who also has the seat. Where two are genuinely side by side — a crew
   * chief trainer and a driver trainer both satisfying "Attendant" — the
   * deeper of the two wins, and the key breaks a remaining tie so the same
   * set always reads the same way.
   */
  async highestOf(keys: Iterable<string>): Promise<string | undefined> {
    const { below, outranking } = await this.graph();
    const held = [...keys];
    if (!held.length) return undefined;

    const outranks = held.find((key) => outranking.has(key));
    if (outranks) return outranks;

    const ranked = held
      .filter((key) => !held.some((other) => below.get(other)?.has(key)))
      .sort((a, b) => {
        const depth = (below.get(b)?.size ?? 0) - (below.get(a)?.size ?? 0);
        return depth !== 0 ? depth : a.localeCompare(b);
      });
    return ranked[0] ?? held[0];
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
