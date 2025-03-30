# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve with lightweight server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]