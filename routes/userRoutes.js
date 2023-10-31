const express = require("express");
const { verifyUserId, displayUserInfo, createUser, retrieveManyUser, retrieveUniqueUser, deleteUser, updateUserPassword, resetPassword, forgetPassword } = require("../controllers/userControllers");
const { requireUser } = require("../middlewares/requireUser");


const router = express.Router()

router.get('/info/:userId/:lang', verifyUserId, displayUserInfo)

router.get("/", retrieveManyUser);

router.get("/id=:userId", retrieveUniqueUser);

router.post("/", createUser);

router.put("/", requireUser, updateUserPassword);

router.put("/reset", requireUser, resetPassword);

router.get("/forget-password", forgetPassword);

router.delete("/:userId", deleteUser);


module.exports = router