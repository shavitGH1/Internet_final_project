# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files and tsconfig from root (context is root directory)
COPY package*.json ./
COPY tsconfig.json ./

# Copy backend source code
COPY Recipe_internet_project/src ./Recipe_internet_project/src/

# Install dependencies (including dev dependencies for build)
RUN npm install

# Build TypeScript to JavaScript
RUN npx tsc

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
