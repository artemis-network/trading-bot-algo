FROM node:16

WORKDIR /app

COPY package.json ./

RUN yarn install 

COPY src ./src

EXPOSE 5000
EXPOSE 587

CMD ["yarn", "run", "dev"]