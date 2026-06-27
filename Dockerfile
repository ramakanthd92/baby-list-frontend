# ── Stage 1: Node builder ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json* ./

RUN npm ci --frozen-lockfile

# Copy source
COPY . .

# Build — VITE_API_BASE_URL is intentionally empty:
# nginx will proxy /listings*, /categories*, /sources* to api:8000
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ── Stage 2: nginx runtime ────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Non-root nginx user (already exists in the nginx image as uid 101)
# We only need to adjust the pid file and log paths

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx pid location which requires root
RUN mkdir -p /var/cache/nginx /var/run /run && \
    chown -R nginx:nginx /var/cache/nginx /var/run /run /usr/share/nginx/html && \
    # Redirect pid file to a path nginx user owns
    sed -i 's|pid\s*/run/nginx.pid;|pid /tmp/nginx.pid;|g' /etc/nginx/nginx.conf && \
    # Allow nginx to bind to port 8080 as non-root
    sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/nginx.conf || true

EXPOSE 8080

USER nginx

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health-check || exit 1

CMD ["nginx", "-g", "daemon off;"]
