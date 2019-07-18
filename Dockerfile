FROM node:current-alpine

WORKDIR /app

COPY package.json /app
COPY src /app/src
COPY public /app/public

RUN npm install
RUN npm install -g serve
RUN npm run build

CMD ["serve", "-s", "build"]
