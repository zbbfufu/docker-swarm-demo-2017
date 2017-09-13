FROM node:8.4.0-alpine

WORKDIR /app
ADD package.json package-lock.json server.js /app/

RUN npm install

EXPOSE 9000
CMD npm start
