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

# App source + SRS content
COPY . .

# Build the frontend into dist/ (the server serves it in production)
RUN npm run build \
    && npm run index

# Make sure the content dir is a git repo so edit auto-commits work even on a
# fresh volume (a real repo with history can be mounted over this).
RUN git config --global user.email "srs-app@local" \
    && git config --global user.name "SRS App" \
    && git config --global --add safe.directory /app \
    && (git rev-parse --is-inside-work-tree >/dev/null 2>&1 || (git init -q && git add -A && git commit -q -m "seed" || true))

ENV NODE_ENV=production
ENV BACKEND_PORT=8787
EXPOSE 8787

CMD ["npm", "run", "start"]
