FROM node:10-alpine as angular
WORKDIR /app
COPY package.json /app
RUN npm install
COPY  . .
RUN npm run build --prod

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf