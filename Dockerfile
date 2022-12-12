FROM node:16

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
ENV GENERATE_SOURCEMAP=false

RUN yarn install 

COPY src ./src
RUN yarn build

EXPOSE 5000
EXPOSE 587

CMD ["yarn", "run", "dev"]