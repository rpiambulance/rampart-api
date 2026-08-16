/**
 * Credential keys are stored with underscores (P_CC) because they are
 * identifiers, but they are always *shown* with dashes (P-CC). Use this
 * anywhere a key reaches a human.
 */
export function formatCredentialKey(key: string): string {
  return key.replace(/_/g, '-');
}
