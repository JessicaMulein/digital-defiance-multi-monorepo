# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npx nx build ai-bbs-lib
RUN npx nx build ai-bbs
RUN npx nx build ai-bbs-node

# Expose the desired port (e.g., 3000, 4200, or 8080)
EXPOSE 3000

# Start the application
CMD ["node", "./dist/apps/ai-bbs-node/main.js"]

