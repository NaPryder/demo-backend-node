const { comparePassword } = require('../utils/bcrypts')
const { getUser } = require('../utils/ormHelpers')
const { generateAccessToken, generateRefreshToken, setRefreshTokenToCookie, setAccessTokenCookie } = require('../utils/tokenizations')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


//login
const createLoginSession = async (req, res, next) => {
  try {
    const { username, password } = req.body


    // check user
    const user = await getUser({ username })
    if (!user) {
      throw new Error("Invalid username or password")
    }

    // compare hash password and request password
    if (!await comparePassword(password, user.password)) {
      throw new Error("Invalid username or password")
    }

    // create refresh token session
    const refreshToken = await generateRefreshToken({ username }, user)

    // create access token
    const accessToken = generateAccessToken({
      username: username,
      role: user.role
    })

    console.log('accessToken :>> ', accessToken);

    // set cookie
    res = setAccessTokenCookie(res, accessToken)
    res = setRefreshTokenToCookie(res, refreshToken)


    res.status(201).json({ status: "ok", accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}


// logout
const deleteLoginSession = (req, res, next) => {

  try {
    console.log('---req.user', req.user);

    // clear cookie
    res = setAccessTokenCookie(res, "")
    res = setRefreshTokenToCookie(res, "")
    res.status(200).send("ok")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createLoginSession,
  deleteLoginSession,
}