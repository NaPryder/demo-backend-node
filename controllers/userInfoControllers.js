const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createUserInfo = (req, res, next) => {
  try {
    const { citizen_id } = req.body
  } catch (error) {

  }
}

module.exports = {
  createUserInfo,
}
