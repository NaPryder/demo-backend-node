const express = require("express");
const { verifyUserId, displayUserInfo } = require("../controllers/userControllers");
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/info/:userId/:lang', verifyUserId, displayUserInfo)



// retrieve
router.get("/", async (req, res) => {
  const q = req.query
  const users = await prisma.user.findMany()
  console.log("request user data", q);
  console.log("users", users);
  res.send(users);
});

// retrieve one
router.get("/id=:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
  })

  if (!user) {
    console.log("no user");
  }
  console.log('user :>> ', user);
  res.send(user);
});

// create
router.post("/", async (req, res) => {
  const { username, password, email } = req.body;
  const createUser = await prisma.user.create({
    data: {
      username,
      password
    }
  })
  res.status(201).json({ username: createUser.username });
});

// update
router.put("/:userId", async (req, res) => {
  const { username, password, rePassword } = req.body;
  const userId = req.params.userId
  console.log('userId :>> ', userId);


  if (password !== rePassword) {
    res.status(404).send("mismatch password")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!user) {
    res.status(404).send("invalid user")
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
});

// delete
router.delete("/:userId", (req, res) => {
  res.status(201).json({
    status: "success",
    log: "delete user successfully",
  });
});


module.exports = router