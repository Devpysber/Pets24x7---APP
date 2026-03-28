# Use Node.js 22
FROM node:22-slim

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
