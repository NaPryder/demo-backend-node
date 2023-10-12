const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


function generateAccessToken(payload) {
  return jwt.sign(
    { payload: payload },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: '10m' }
  );
}
async function generateRefreshToken(payload, user) {

  // generate token
  const refreshToken = jwt.sign(
    { payload: payload },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '1h' }
  );

  // update token to user token
  user = await prisma.user.update({
    where: { id: user.id },
    data: {
      token: {
        upsert: {
          create: { token: refreshToken },
          update: { token: refreshToken },
        },
      },
    }
  })

  return refreshToken
}

async function verifyJWT(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null
  }
}
async function verifyAccessToken(token) {
  return await verifyJWT(token, process.env.ACCESS_TOKEN_SECRET_KEY)
}

async function verifyRefreshToken(token) {
  return await verifyJWT(token, process.env.REFRESH_TOKEN_SECRET_KEY)

}

function setRefreshTokenToCookie(res, refreshToken, maxAge = 3600000) {
  res.cookie("refreshToken", refreshToken, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
  })
  return res
}

function setAccessTokenCookie(res, accessToken, maxAge = 100000) {
  res.cookie("accessToken", accessToken, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
  })
  return res
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenToCookie,
  setAccessTokenCookie
}