# Multi-stage production Dockerfile for Project ELARA
# Stage 1: Build User Application
FROM node:20-alpine AS user-builder
WORKDIR /build/user
COPY User/package*.json ./
RUN npm ci
COPY User/ ./
RUN npm run build

# Stage 2: Build Admin Application
FROM node:20-alpine AS admin-builder
WORKDIR /build/admin
COPY admin/package*.json ./
RUN npm ci
COPY admin/ ./
RUN npm run build

# Stage 3: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for server and monitoring
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source & pre-built client bundles
COPY server.js ./
COPY --from=user-builder /build/user/dist ./User/dist
COPY --from=admin-builder /build/admin/dist ./admin/dist

# Expose server port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start production server
CMD ["node", "server.js"]
