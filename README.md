# Boiler template for backend

## Node.js (express) + Docker + Prisma

### hand on basic access token and refresh token

## Get start

### add .env file

SALT_ROUND=11
PORT=3000
ACCESS_TOKEN_SECRET_KEY="SECRET1"
REFRESH_TOKEN_SECRET_KEY="SECRET2"

### build container demo-backend-node

docker compose build

docker compose up -d

or

docker compose up --build -d

### exec to backend-node container for migrate

npx prisma migrate dev

### run this in execute everytime when change prisma file

npx prisma generate
