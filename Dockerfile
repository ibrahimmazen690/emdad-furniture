# ─────────────────────────────────────────────────────────────────────────────
# EMDAD — production image. One container serves the built React SPA AND the
# Express API (Claude proxy + SQLite projects + admin auth) on a single port.
# ─────────────────────────────────────────────────────────────────────────────

# ── Build stage: install all deps, build the frontend, prune to prod deps ─────
FROM node:20-bookworm AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Keep production deps only (sqlite3 stays compiled for the next stage).
RUN npm prune --omit=dev

# ── Runtime stage: slim image with just what the server needs ─────────────────
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src/data ./src/data
COPY --from=build /app/scripts ./scripts

# Default data dirs. Mount a persistent volume at /data so the SQLite database
# and audit log survive restarts/redeploys (override with DB_DIR / LOG_DIR).
ENV DB_DIR=/data/db
ENV LOG_DIR=/data/logs
RUN mkdir -p /data/db /data/logs

# The host injects PORT; the server reads process.env.PORT (falls back to 3001).
EXPOSE 3001
CMD ["node", "server.js"]
