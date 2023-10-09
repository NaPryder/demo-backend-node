FROM node:16-bullseye-slim 

# Install openssl for Prisma
# RUN apt-get update && apt-get install -y openssl

WORKDIR /app 

COPY package*.json ./
# RUN apt-get update && apt-get install -y openssl
RUN npm ci
COPY . .

# prevent bcrypt error
RUN npm uninstall bcrypt
RUN npm i bcrypt

EXPOSE 3000

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]