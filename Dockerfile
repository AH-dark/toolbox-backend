FROM node:alpine

WORKDIR /app

COPY package.json /app
RUN npm install && npm cache clean

COPY . /app

EXPOSE 9000
ENV PORT 9000

ENTRYPOINT ["node", "./node_modules/supervisor/lib/cli-wrapper.js", "./index.js"]
