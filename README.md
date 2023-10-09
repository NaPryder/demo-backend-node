# Boiler template for backend

## Node.js (express) + Docker + Prisma

### hand on basic access token and refresh token

## Get start

### add .env file

SALT_ROUND=11
PORT=3000
ACCESS_TOKEN_SECRET_KEY="SECRET"
REFRESH_TOKEN_SECRET_KEY="SECRET"

### demo-backend-node

docker compose build

docker compose up -d

### exec to backend-node container for migrate

npx prisma migrate dev

### run this in execute everytime when change prisma file

npx prisma generate
