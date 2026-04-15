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

# Start
USER node
CMD ["node", "dist/main"]