# SRS Knowledge Base — single-container production image.
# Express serves the API and the built Vite frontend on one port.
FROM node:20-bookworm-slim

# git is needed for the in-app edit auto-commit / version history feature.
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# App source + SRS content (this is the seed content; if DATA_DIR points at a
# separate persistent volume at runtime, it's copied there once on first boot)
COPY . .

# Build the frontend into dist/ (the server serves it in production).
# The index is NOT built here: INDEX_DIR lives under DATA_DIR, which only
# resolves to a real path at runtime (once DATA_DIR is known), so the server
# builds it on first boot instead. See backend/indexer.ts + server.ts.
RUN npm run build

# Git identity for auto-commits; ensureGitRepo() (backend/git.ts) initializes
# the actual content repo under DATA_DIR at runtime, not here.
RUN git config --global user.email "srs-app@local" \
    && git config --global user.name "SRS App"

ENV NODE_ENV=production
ENV BACKEND_PORT=8787
EXPOSE 8787

CMD ["npm", "run", "start"]
