FROM node:22.13.0

WORKDIR /APP

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]