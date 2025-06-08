# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose frontend port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev"]
