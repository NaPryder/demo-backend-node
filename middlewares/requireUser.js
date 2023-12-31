

const requireUser = (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("Invalid session")
    }

    // found user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { requireUser }