const { PrismaClient } = require('@prisma/client')
const { encryptPassword, comparePassword } = require('../utils/bcrypts')
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

// update password
const updateUserPassword = async (req, res, next) => {
  try {

    const { username, oldPassword, newPassword, reNewPassword } = req.body;
    console.log('req.user :>> ', req.user);
    console.log('username :>> ', username);

    // validation
    if (username != req.user.username) {
      throw new Error("Unauthorized")
    }
    if (newPassword !== reNewPassword) {
      throw new Error("Mismatch password")
    }
    else if (newPassword == oldPassword) {
      throw new Error("Invalid new-password")
    }

    // get user
    const user = await getUser({
      username: username,
    })
    if (!user) {
      throw new Error("Invalid username or password1")
    }

    // compare old password
    if (!await comparePassword(oldPassword, user.password)) {
      throw new Error("Invalid username or password2")
    }

    // encrypt password
    const hashedPassword = await encryptPassword(newPassword)

    // update new password to db
    await prisma.user.update({
      where: {
        username: username
      },
      data: {
        password: hashedPassword
      }
    })
    res.status(201).send('ok')

  } catch (error) {
    next(error)
  }
}

// reset password
const resetPassword = async (req, res, next) => {
  try {

    // get user
    const user = await getUser({
      username: req.user.username,
    })
    if (!user) {
      throw Error("Invalid user")
    }

    // random
    let newPassword = (Math.random() + 1).toString(36).substring(7);

    // encrypt password
    const hashedPassword = await encryptPassword(newPassword)

    // update new password to db
    await prisma.user.update({
      where: {
        username: req.user.username
      },
      data: {
        password: hashedPassword
      }
    })

    res.send({ newPassword })
  } catch (error) {
    next(error)
  }
}

// forget password
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('email :>> ', email);

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
  displayUserInfo,
  resetPassword,
  forgetPassword,
}