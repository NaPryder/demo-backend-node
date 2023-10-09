const { verifyAccessToken, verifyRefreshToken, generateRefreshToken, setRefreshTokenToCookie } = require("../utils/tokenizations");

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const deserializeUser = async (req, res, next) => {
  console.log('req.cookies :>> ', req.cookies);
  const { accessToken, refreshToken } = req.cookies;
  console.log(' cookie accessToken :>> ', accessToken);
  console.log(' cookie refreshToken :>> ', refreshToken);

  // verify access token
  const decoded = await verifyAccessToken(accessToken)
  console.log('decoded :>> ', decoded);

  // valid access token
  if (decoded) {
    // attach user
    req.user = decoded.payload
    return next()
  }

  // not found access token or expired access token

  // not found refreshToken
  if (!refreshToken) {
    console.log("no rf");
    return next()
  }

  // verify refresh token
  const refresh = await verifyRefreshToken(refreshToken)
  console.log('found rf:>> ', refresh);
  if (!refresh) {
    return next() // invalid refresh token
  }

  // valid refresh token

  // get token session
  const tokenSession = await prisma.token.findFirst({
    where: {
      token: refreshToken
    },
    select: {
      user: true,
      token: true
    }
  })

  console.log('tokenSession :>> ', tokenSession);

  // no session
  if (!tokenSession) {
    console.log('no token session :>> ');
    return next()
  }

  // valid refresh token >> create new refresh token
  const payload = { username: tokenSession.user.username }
  const newRefreshToken = generateRefreshToken(payload, tokenSession.user)
  res = setRefreshTokenToCookie(res, newRefreshToken)
  console.log('newRefreshToken :>> ', newRefreshToken);
  req.user = {
    username: tokenSession.user.username,
    role: tokenSession.user.role
  }
  next()
}

module.exports = { deserializeUser }