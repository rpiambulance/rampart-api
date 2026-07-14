// jose is ESM-only, which CJS ts-jest cannot load. E2E tests override
// AuthGuard entirely, so these stubs are never actually invoked.
export const createRemoteJWKSet = () => {
  throw new Error('jose stub — not available in tests');
};
export const jwtVerify = () => {
  throw new Error('jose stub — not available in tests');
};
