# Stage 1: Base - Install dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development - Run Vite dev server
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 3: Build - Build for production
FROM base AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 4: Production - Serve with Nginx
FROM nginx:alpine AS production
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy only the built files from the build stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Expose the application port (Vite default as requested)
EXPOSE 5174
