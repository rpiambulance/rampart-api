export type AuthContext = {
    kind: 'member';
    memberId: number;
    permissions: Set<string>;
} | {
    kind: 'api-token';
    apiTokenId: number;
    permissions: Set<string>;
};
