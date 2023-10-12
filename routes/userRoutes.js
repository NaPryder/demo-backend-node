const express = require("express");
const { verifyUserId, displayUserInfo, createUser, retrieveManyUser, retrieveUniqueUser, deleteUser, updateUserPassword } = require("../controllers/userControllers");


const router = express.Router()

router.get('/info/:userId/:lang', verifyUserId, displayUserInfo)

router.get("/", retrieveManyUser);

router.get("/id=:userId", retrieveUniqueUser);

router.post("/", createUser);

router.put("/:userId", verifyUserId, updateUserPassword);

router.delete("/:userId", deleteUser);


module.exports = router