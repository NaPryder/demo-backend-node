const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// Factory function
const getUser = async (condition) => {
  return await await prisma.user.findUnique({
    where: { ...condition }
  })
}

module.exports = {
  getUser
}