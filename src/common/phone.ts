/**
 * Phone numbers are stored in one shape: (518) 555-1234.
 *
 * Only a value that is exactly ten digits once punctuation is removed gets
 * reformatted. Anything else — a seven-digit local number, an extension, a
 * number carrying a country code, or free text — is kept exactly as entered
 * rather than mangled into a shape it does not fit.
 */
export function normalizePhone<T extends string | null | undefined>(value: T): T {
  if (typeof value !== 'string') return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` as T;
}
