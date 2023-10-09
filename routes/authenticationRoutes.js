const express = require("express");
const { createLoginSession, deleteLoginSession } = require("../controllers/authenticationControllers");
const { requireUser } = require("../middlewares/requireUser");

const router = express.Router()

router.post('/login', createLoginSession)
router.delete('/logout', requireUser, deleteLoginSession)

module.exports = router