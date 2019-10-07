FROM node:11 as build

USER root

WORKDIR /usr/src/awesome
COPY ./package.* ./
RUN npm i

COPY . .



RUN npm run build

FROM nginx:1.15

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/awesome/build/ /var/www/awesome/
