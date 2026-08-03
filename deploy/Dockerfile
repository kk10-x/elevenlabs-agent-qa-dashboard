# syntax=docker/dockerfile:1
# Multi-stage: build the static Vite demo, then serve it from nginx.
# bella only needs Docker for this — no host Node, no backend, no DB.

# --- build stage -------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- serve stage -------------------------------------------------------------
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
