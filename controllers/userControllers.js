
function getUserRoles(userId) {

  // do something
  return {
    userId,
    role: "Staff",
    name: "AA",
    tel: "011111111",
    location: "BKK"
  }
  
}
const verifyUserId = (req, res, next) => {
  const { userId } = req.params;


  req.userRoles = getUserRoles(userId)

  if (userId === "1") {
    console.log('userId :>> ', userId, "PASS");
    res.send("PASS")
  } 
  else if (userId === "5") {
    console.log('userId :>> ', userId, "next");
    next()
  }
  else {
    console.log('userId :>> ', userId, "FAIL");
    res.send("FAIL")
  }
}

const displayUserInfo = (req, res) => {
  const { userId } = req.params;

    console.log("this AUTH function", userId);

    console.log('req.userInfo :>> ', req.userRoles);
    res.send('DONE')
}


module.exports = {
  getUserRoles,
  verifyUserId,
  displayUserInfo
}