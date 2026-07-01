FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]