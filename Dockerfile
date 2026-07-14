# Rampart API — production image (target: linux/amd64 for Coolify)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
# prisma.config.ts resolves DATABASE_URL at load time; generate doesn't
# connect, so a placeholder satisfies it during the image build.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    npx prisma generate && npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
EXPOSE 3001
# Apply migrations, then start.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
