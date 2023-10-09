const bcrypt = require('bcrypt');

async function encryptPassword(plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, parseInt(process.env.SALT_ROUND))
}

async function comparePassword(plainTextPassword, hashedPassword) {

  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

module.exports = {
  encryptPassword,
  comparePassword
}