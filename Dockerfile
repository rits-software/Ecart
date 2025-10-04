# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
ENV PORT=5000
EXPOSE $PORT

# Start the app from compiled JS
CMD ["node", "dist/index.js"]
