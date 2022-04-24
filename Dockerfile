FROM node:16
WORKDIR /usr/src/clean-node-api
COPY package.json .
ENV NODE_ENV=production
RUN npm install --production --legacy-peer-deps