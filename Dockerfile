# pull official base image
FROM node:18

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm i --legacy-peer-deps
COPY ./ ./


CMD ["npm", "run", "start"]
