# Use Node.js base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy all files (including server.js and public/)
COPY . .

# Expose server port
EXPOSE 80

# Start server process
CMD ["npm", "start"]
