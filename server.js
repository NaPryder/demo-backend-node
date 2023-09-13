const express = require("express");
require("dotenv").config()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const app = express();
const port = process.env.PORT;

// import routes
const userRoutes = require("./routes/userRoutes")

app.use(express.json());


app.post("/api/users/login", (req, res) => {
  const body = req.body
  console.log('body :>> ', body);
  res.json({
    "user": {
      "email": "jake@jake.jake",
      "token": "jwt.token.here",
      "username": "jake",
      "bio": "I work at statefarm",
      "image": null
    }
  })
})

app.get("/", async (req, res) => {
  const user = await prisma.user.findFirst()
  console.log('user :>> ', user);
  res.send(`<h1>Hello ${user.username}</h1>`);
});
app.use("/user", userRoutes)
// app.use("/blog", userRoutes)




// listening server
app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
