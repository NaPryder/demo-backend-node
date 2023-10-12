const { verifyAccessToken, verifyRefreshToken, generateRefreshToken, setRefreshTokenToCookie, generateAccessToken } = require("../utils/tokenizations");

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const deserializeUser = async (req, res, next) => {
  console.log('req.cookies :>> ', req.cookies);
  const { accessToken, refreshToken } = req.cookies;
  // const { access_token, refresh_token } = req.headers;
  console.log(' cookie accessToken :>> ', accessToken);
  console.log(' cookie refreshToken :>> ', refreshToken);
  // console.log(' cookie access_token :>> ', access_token);
  // console.log(' cookie refresh_token :>> ', refresh_token);

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
  const refreshTokenPayload = { username: tokenSession.user.username }
  const newRefreshToken = generateRefreshToken(refreshTokenPayload, tokenSession.user)

  // generate new access token
  const accessTokenPayload = {
    username: tokenSession.user.username,
    role: tokenSession.user.role
  }

  const newAccessToken = generateAccessToken(accessTokenPayload)

  res = setRefreshTokenToCookie(res, newRefreshToken)
  res = setAccessTokenCookie(res, newAccessToken)

  req.user = accessTokenPayload

  next()
}

module.exports = { deserializeUser }