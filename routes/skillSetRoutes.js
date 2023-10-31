const express = require("express");
const { createSkill, deleteSkill, getSkills } = require("../controllers/skillSetControllers");
const { userHasPermission } = require("../middlewares/permission");
const { requireUser } = require("../middlewares/requireUser");
const { Role } = require("@prisma/client");
const router = express.Router()

router.get("/", getSkills)
router.post("/", createSkill)
router.delete("/:name", requireUser, userHasPermission(Role.BASIC), deleteSkill)

module.exports = router