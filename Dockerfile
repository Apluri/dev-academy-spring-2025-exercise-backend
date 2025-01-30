# Use Node.js for the runtime
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

COPY prisma ./prisma
RUN npx prisma generate

CMD ["npx", "ts-node", "src/server.ts"]

EXPOSE 3000
