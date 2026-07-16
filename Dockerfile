# Rampart API — production image (target: linux/amd64 for Coolify)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

FROM deps AS build
COPY . .
# prisma.config.ts resolves DATABASE_URL at load time; generate doesn't
# connect, so a placeholder satisfies it during the image build.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    npx prisma generate && npm run build

# Dev/tools target: full source + dev deps (tsx, prisma CLI) for seeding,
# migrations, and the legacy ETL inside Docker: `docker compose run --rm seed`
FROM build AS dev
CMD ["npm", "run", "start:dev"]

FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
RUN npm prune --omit=dev
EXPOSE 3001
# Apply migrations, then start.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
