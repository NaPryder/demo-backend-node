FROM node:16-alpine

WORKDIR /app/backend

ENV PORT=3000

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD npm run dev