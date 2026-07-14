"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialGraphService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CredentialGraphService = class CredentialGraphService {
    prisma;
    cache;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async graph() {
        if (this.cache && Date.now() - this.cache.at < 60_000)
            return this.cache;
        const types = await this.prisma.credentialType.findMany({
            include: { prerequisites: true },
        });
        const idToKey = new Map(types.map((t) => [t.id, t.key]));
        const keyToId = new Map(types.map((t) => [t.key, t.id]));
        const parents = new Map();
        for (const t of types) {
            parents.set(t.key, t.prerequisites.map((p) => idToKey.get(p.requiresTypeId)));
        }
        const ancestorsOf = new Map();
        const resolve = (key) => {
            const memo = ancestorsOf.get(key);
            if (memo)
                return memo;
            const out = new Set();
            ancestorsOf.set(key, out);
            for (const parent of parents.get(key) ?? []) {
                out.add(parent);
                for (const a of resolve(parent))
                    out.add(a);
            }
            return out;
        };
        const satisfiedBy = new Map();
        for (const t of types)
            satisfiedBy.set(t.key, new Set([t.key]));
        for (const t of types) {
            for (const ancestor of resolve(t.key)) {
                satisfiedBy.get(ancestor)?.add(t.key);
            }
        }
        this.cache = { at: Date.now(), satisfiedBy, idToKey, keyToId };
        return this.cache;
    }
    async satisfies(heldKeys, requiredKey) {
        const { satisfiedBy } = await this.graph();
        const satisfying = satisfiedBy.get(requiredKey);
        if (!satisfying)
            return false;
        for (const key of heldKeys)
            if (satisfying.has(key))
                return true;
        return false;
    }
    holdsExactly(heldKeys, key) {
        return heldKeys.has(key);
    }
    async heldKeys(memberId) {
        const creds = await this.prisma.memberCredential.findMany({
            where: { memberId, status: 'ACTIVE' },
            include: { type: { select: { key: true } } },
        });
        return new Set(creds.map((c) => c.type.key));
    }
    async typeIdForKey(key) {
        const { keyToId } = await this.graph();
        return keyToId.get(key);
    }
};
exports.CredentialGraphService = CredentialGraphService;
exports.CredentialGraphService = CredentialGraphService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CredentialGraphService);
//# sourceMappingURL=credential-graph.service.js.map