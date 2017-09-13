FROM node:8.4.0-alpine

WORKDIR /app
ADD package.json package-lock.json server.js /app/

RUN npm install

EXPOSE 3000
CMD npm start
