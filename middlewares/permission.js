


const validatePermission = (req, res, next) => {
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

const userHasPermission = (permission) => {

  return (req, res, next) => {
    console.log('permission :>> ', permission);
    console.log('req.user :>> ', req.user);
    try {
      if (!req.user) {
        throw new Error("Invalid session")
      }

      else if (req.user.role !== permission) {
        throw new Error("Unauthorized")
      }

      next()
    } catch (error) {
      next(error)
    }
  }

}

module.exports = {
  userHasPermission
}