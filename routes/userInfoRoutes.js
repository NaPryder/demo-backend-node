const express = require("express");
const { createUserInfo } = require("../controllers/userInfoControllers");
const router = express.Router()


// create user info
router.post('/', createUserInfo)