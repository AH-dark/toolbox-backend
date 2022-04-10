FROM node:alpine

WORKDIR /app

COPY package.json /app
RUN npm install --production

COPY . /app

EXPOSE 9000
ENV PORT 9000

ENTRYPOINT ["npm", "run", "start"]
