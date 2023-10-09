
const logError = ((err, req, res, next) => {
  console.error(err)
  next(err)
})
const handleError = ((err, req, res, next) => {
  res.status(400).send({
    message: err.message
  })
})

module.exports = {
  logError,
  handleError
}
