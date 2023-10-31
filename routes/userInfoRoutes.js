const express = require("express");
const { editUserInfo, getUserInfo } = require("../controllers/userInfoControllers");
const { requireUser } = require("../middlewares/requireUser");
const router = express.Router()


// edit user info
router.post('/', requireUser, editUserInfo)

router.get('/', requireUser, getUserInfo)

module.exports = router