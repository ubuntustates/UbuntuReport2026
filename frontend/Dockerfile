# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock files first
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# ---------- Stage 2: Run ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built files and minimal dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm install --omit=dev

# Expose the port Next.js listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
