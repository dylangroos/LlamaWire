# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the application code and config files
# Create the target public directory explicitly
RUN mkdir public
# Copy files individually into the created public directory
COPY public/logo.png ./public/
COPY public/dark-logo.png ./public/

COPY src/ ./src/
COPY vite.config.mjs ./
# Add any other necessary config files

# Copy index.html from the source root to the build context root (/app)
# Vite build should find this by default as the entry point
COPY index.html ./

# Build the application
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:stable-alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage
# Vite build output goes to /app/dist by default
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]