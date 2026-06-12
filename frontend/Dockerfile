# ==========================================
# STAGE 1: Build the React Application
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json first to cache npm dependencies
COPY package*.json ./
RUN npm ci

# Copy code and compile Vite build
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Serve using Nginx
# ==========================================
FROM nginx:alpine

# Copy custom nginx routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
