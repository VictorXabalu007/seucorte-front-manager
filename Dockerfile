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

# Stage 4: Production - Serve with Node (serve package)
FROM node:20-alpine AS production
WORKDIR /app
# Install `serve` globally to serve static files
RUN npm install -g serve
# Copy built static files from the build stage
COPY --from=build /app/dist ./dist
# Expose the same port used in preview/dev
EXPOSE 5173
# Start serve on port 5173, routing all requests to index.html (-s)
CMD ["serve", "-s", "dist", "-l", "5173"]
