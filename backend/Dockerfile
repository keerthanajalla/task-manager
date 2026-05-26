# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY .env.example .env

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start the app
CMD ["node", "src/app.js"]
