FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm instgit config --global --unset credential.helperall
COPY frontend/ .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html