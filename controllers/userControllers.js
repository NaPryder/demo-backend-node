const { PrismaClient } = require('@prisma/client')
const { encryptPassword } = require('../utils/bcrypts')
const { getUser } = require('../utils/ormHelpers')
const prisma = new PrismaClient()

function getUserRoles(userId) {

  // do something
  return {
    userId,
    role: "Staff",
    name: "AA",
    tel: "011111111",
    location: "BKK"
  }

}
const verifyUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUser({ id: userId })
    if (!user) throw new Error("Do not have permission")
    req.userId = userId
    next()
  } catch (error) {
    next(error)
  }
}


const displayUserInfo = (req, res) => {
  const { userId } = req.params;

  console.log("this AUTH function", userId);

  console.log('req.userInfo :>> ', req.userRoles);
  res.send('DONE')
}



// create
const createUser = async (req, res, next) => {
  try {
    const { username, password, rePassword } = req.body;

    // validation
    if (password !== rePassword) {
      throw new Error("Invalid password and re-password")
    }

    // check exist username
    const user = await getUser({ username: username })
    if (user) {
      throw Error("Username has already used.")
    }

    // encrypt password
    const hashedPassword = await encryptPassword(password)

    const createdUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword
      }
    })

    res.status(201).json({
      username,
      id: createdUser.id,
      role: createdUser.role
    });
  } catch (error) {
    next(error)
  }
}

// retrieve
const retrieveManyUser = async (req, res, next) => {
  const q = req.query
  const users = await prisma.user.findMany()
  console.log("request user data", q);
  console.log("users", users);
  res.send(users);
}

// retrieve one
const retrieveUniqueUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await getUser({ id: userId })
    if (!user) throw new Error(`Not found user ${userId}`)
    res.send(user);
  } catch (error) {
    next(error)
  }
}

// update
const updateUserPassword = async (req, res, next) => {
  try {
    const { userId } = req
    const { username, oldPassword, password, rePassword } = req.body;
    console.log('userId :>> ', userId);

    const user = await getUser({
      username: username,
      id: userId,
    })

    if (password !== rePassword) {
      res.status(404).send("mismatch password")
    }
    else if (!user) {
      throw new Error("invalid user")
    }
    else if (user.password !== oldPassword) {
      throw new Error("invalid old password")
    }


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: password,
      },
    })

    console.log('updatedUser :>> ', updatedUser);

    res.status(201).json({
      ...updatedUser,
      status: "success",
      log: "update user successfully",
    });
  } catch (error) {
    next(error)
  }
}

// delete
const deleteUser = (req, res) => {
  res.status(201).json({
    status: "success",
    log: "delete user successfully",
  });
}

module.exports = {
  retrieveManyUser,
  retrieveUniqueUser,
  updateUserPassword,
  deleteUser,
  createUser,
  getUserRoles,
  verifyUserId,
  displayUserInfo
}