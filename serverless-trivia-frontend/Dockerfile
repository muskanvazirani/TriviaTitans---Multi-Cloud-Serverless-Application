FROM node:16 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html
