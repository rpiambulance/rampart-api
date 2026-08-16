/**
 * Uniqueness-conflict prompting for the legacy ETL.
 *
 * The legacy MySQL schema enforced almost no uniqueness, so its data routinely
 * violates constraints that Postgres does enforce (duplicate emails, reused
 * radio numbers, a member who already exists here from the admin bootstrap).
 * Rather than aborting the import — or silently mangling the value — every
 * conflict is handed to the administrator running the migration, who decides
 * what to do with it.
 */

export type ConflictAction = 'link' | 'replace' | 'skip';

export interface ConflictOption {
  action: ConflictAction;
  label: string;
  description: string;
  /** Prefilled value for `replace` (a safe, guaranteed-unique suggestion). */
  suggestion?: string;
}

export interface MigrationConflict {
  /** Correlates the prompt with the answer. */
  id: string;
  /** Prisma model, e.g. "Member". */
  entity: string;
  /** Human description of the legacy row, e.g. 'legacy member 3 (Bob Shared)'. */
  label: string;
  /** The unique field(s) that collided. */
  fields: string[];
  /** The colliding values, keyed by field. */
  values: Record<string, string>;
  /** The row that already owns the value, when we could identify it. */
  existing?: { id: number; summary: string };
  options: ConflictOption[];
}

export interface ConflictResolution {
  action: ConflictAction;
  /** Required for `replace`: the new value for the conflicting field. */
  value?: string;
}

export type ConflictResolver = (
  conflict: MigrationConflict,
) => Promise<ConflictResolution>;

/** Existing row that owns a conflicting value. */
export interface ExistingRef {
  id: number;
  summary: string;
  /** False when linking would corrupt data (row already owned by another legacy record). */
  linkable?: boolean;
}

export interface ConflictContext {
  resolve: ConflictResolver;
  record: (message: string) => void;
}

interface WriteSpec<T> {
  entity: string;
  label: string;
  data: Record<string, unknown>;
  /** Performs the write. Called again with amended data after a `replace`. */
  write: (data: Record<string, unknown>) => Promise<T>;
  /** Locates the row already holding `value` for `field`. */
  findExisting?: (
    field: string,
    value: unknown,
  ) => Promise<ExistingRef | null | undefined>;
  /** Adopts the existing row instead of creating a new one (`link`). */
  link?: (existingId: number, data: Record<string, unknown>) => Promise<T>;
  /** A guaranteed-unique replacement for `field`, offered as the prefill. */
  suggest?: (field: string, data: Record<string, unknown>) => string | undefined;
  /** Fields that may be emptied instead of replaced (nullable columns). */
  clearable?: (field: string) => boolean;
}

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2002';
}

/**
 * Prisma reports the offending columns differently per driver: `meta.target`
 * on the library engine (an array of fields, or a raw constraint name), and
 * `meta.driverAdapterError.cause.constraint` on the driver adapters — which
 * itself carries either `fields` or an index name.
 */
function conflictFields(error: unknown, data: Record<string, unknown>): string[] {
  const meta = (error as { meta?: Record<string, any> })?.meta ?? {};

  const constraint = meta.driverAdapterError?.cause?.constraint;
  if (Array.isArray(constraint?.fields) && constraint.fields.length) {
    return constraint.fields.map(String);
  }

  const raw =
    (typeof constraint === 'string' ? constraint : undefined) ??
    constraint?.index ??
    meta.target;

  if (Array.isArray(raw) && raw.length) return raw.map(String);
  if (typeof raw === 'string' && raw) {
    // "Member_email_key" -> ["email"]
    const parts = raw.replace(/_key$|_unique$/, '').split('_');
    const known = parts.filter((part: string) => part in data);
    if (known.length) return known;
    // Fall back to the longest trailing segment, minus the model prefix.
    return [parts.length > 1 ? parts.slice(1).join('_') : raw];
  }
  return ['(unknown field)'];
}

let counter = 0;

/**
 * Attempts a write, prompting the administrator on any uniqueness violation
 * and retrying with their answer. Returns null when they choose to skip.
 */
export async function writeWithConflictPrompt<T>(
  ctx: ConflictContext,
  spec: WriteSpec<T>,
): Promise<T | null> {
  let data = { ...spec.data };

  // Bounded so a resolver that keeps returning a colliding value cannot spin.
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      return await spec.write(data);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;

      const fields = conflictFields(error, data);
      const field = fields[0];
      const value = data[field];
      const existing = spec.findExisting
        ? ((await spec.findExisting(field, value)) ?? undefined)
        : undefined;
      const suggestion = spec.suggest?.(field, data);

      const options: ConflictOption[] = [];
      if (spec.link && existing && existing.linkable !== false) {
        options.push({
          action: 'link',
          label: `Use the existing record (#${existing.id})`,
          description:
            `Treat ${spec.label} and ${existing.summary} as the same ` +
            'record. Nothing already stored on it is overwritten.',
        });
      }
      const canClear = spec.clearable?.(field) ?? false;
      options.push({
        action: 'replace',
        label: `Enter a different ${field}`,
        description:
          `Import ${spec.label} as a new record using a ${field} you supply.` +
          (canClear ? ` Leave it blank to import the record with no ${field}.` : ''),
        suggestion,
      });
      options.push({
        action: 'skip',
        label: 'Skip this record',
        description: `Do not import ${spec.label}. Related rows that reference it are skipped too.`,
      });

      const conflict: MigrationConflict = {
        id: `c${++counter}`,
        entity: spec.entity,
        label: spec.label,
        fields,
        values: Object.fromEntries(
          fields.map((f) => [f, data[f] === undefined ? '' : String(data[f])]),
        ),
        existing: existing && { id: existing.id, summary: existing.summary },
        options,
      };

      const answer = await ctx.resolve(conflict);

      if (answer.action === 'skip') {
        ctx.record(`  ! ${spec.label}: skipped by administrator (${field} conflict)`);
        return null;
      }
      if (answer.action === 'link') {
        if (!spec.link || !existing) {
          throw new Error(
            `Cannot link ${spec.label}: no existing record was identified.`,
          );
        }
        ctx.record(
          `  ${spec.label}: linked to existing ${spec.entity} #${existing.id} by administrator`,
        );
        return await spec.link(existing.id, data);
      }
      const replacement = (answer.value ?? '').trim();
      if (!replacement) {
        if (!canClear) {
          throw new Error(
            `A replacement ${field} is required to import ${spec.label}.`,
          );
        }
        ctx.record(`  ${spec.label}: ${field} cleared by administrator`);
        data = { ...data, [field]: null };
        continue;
      }
      ctx.record(
        `  ${spec.label}: ${field} changed to ${replacement} by administrator`,
      );
      data = { ...data, [field]: replacement };
    }
  }
  throw new Error(
    `Gave up resolving uniqueness conflicts for ${spec.label} after 25 attempts.`,
  );
}

/**
 * Generic safety net for the ETL's remaining write sites. Any uniqueness
 * violation we did not anticipate becomes a prompt (skip this record) instead
 * of aborting the whole import.
 */
export async function guardRecord<T>(
  ctx: ConflictContext,
  entity: string,
  label: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    const fields = conflictFields(error, {});
    const answer = await ctx.resolve({
      id: `c${++counter}`,
      entity,
      label,
      fields,
      values: {},
      options: [
        {
          action: 'skip',
          label: 'Skip this record',
          description:
            `${label} collides with a record already in the database on ` +
            `${fields.join(', ')}. Skipping leaves the existing record untouched.`,
        },
      ],
    });
    if (answer.action !== 'skip') {
      throw new Error(
        `${label}: only "skip" can resolve a ${fields.join(', ')} conflict here.`,
      );
    }
    ctx.record(`  ! ${label}: skipped by administrator (${fields.join(', ')} conflict)`);
    return null;
  }
}
