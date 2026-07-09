FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html