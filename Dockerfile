# Base on Node.js LTS (Long Term Support)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy necessary files from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the port the app will run on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]