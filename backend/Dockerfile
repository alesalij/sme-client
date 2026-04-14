# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies (built locally)
COPY dist ./dist
COPY node_modules ./node_modules
COPY package*.json ./

# Create logs directory with proper permissions
RUN mkdir -p logs && chown -R node:node logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start
USER node
CMD ["node", "dist/main"]