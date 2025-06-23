# Use Node.js 20 with Alpine for smaller image size
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build the application
RUN npm run build

# Remove development dependencies and source files
RUN rm -rf src/ node_modules/
RUN npm ci --only=production && npm cache clean --force

# Switch to non-root user
USER nodejs

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
