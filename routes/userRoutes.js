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
router.get("/id=:userId", (req, res) => {
  const { userId } = req.params;

  console.log("request user data in id", userId);
  res.send(`one user data from id ${userId}`);
});

// create
router.post("/", (req, res) => {
  const body = req.body;
  res.status(201).json({
    ...body,
    status: "success",
    log: "create user successfully",
  });
});

// update
router.put("/:userId", (req, res) => {
  const body = req.body;
  res.status(201).json({
    ...body,
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