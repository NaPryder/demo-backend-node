const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const editUserInfo = async (req, res, next) => {
  try {
    const { citizenId, email, firstname, lastname } = req.body

    // validate email
    let foundUserInfo = await prisma.userInfo.findUnique({
      where: { email },
      include: {
        user: true
      }
    })

    console.log('foundUserInfo 1:>> ', foundUserInfo);
    if (foundUserInfo && foundUserInfo.user.username !== req.user.username) {
      throw Error(`Email '${email}' has already used.`)
    }

    // validate citizen id
    console.log('object :>> ', /^\d{13}$/.test(citizenId));
    if (! /^\d{13}$/.test(citizenId)) {
      throw Error("Invalid citizen id")
    }

    // check citizen id
    foundUserInfo = await prisma.userInfo.findUnique({
      where: { citizenId },
      include: {
        user: true
      }
    })
    console.log('foundUserInfo 2:>> ', foundUserInfo);
    if (foundUserInfo && foundUserInfo.user.username !== req.user.username) {
      throw Error(`Citizen id '${citizenId}' has already used.`)
    }

    // update user info
    const user = await prisma.user.update({
      where: { username: req.user.username },
      data: {
        userInfo: {
          upsert: {
            create: { citizenId, email, firstname, lastname },
            update: { citizenId, email, firstname, lastname },
          },
        },
      },
      select: {
        username: true,
        role: true,
        userInfo: true, // Include all posts in the returned object
      },
    })
    res.status(201).send(user)
  } catch (error) {
    next(error)

  }
}

const getUserInfo = async (req, res, next) => {
  try {
    const userInfo = await prisma.userInfo.findMany({
      where: {
        user: {
          username: req.user.username
        }
      },
    })

    if (userInfo.length === 0) {
      throw Error("Not found user info")
    }

    res.status(200).json(userInfo[0])
  } catch (error) {
    next(error)
  }
}

module.exports = {
  editUserInfo,
  getUserInfo,
}
