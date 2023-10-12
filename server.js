const express = require("express");
const cookieParser = require('cookie-parser')
require("dotenv").config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app = express();
const port = process.env.PORT;

// import routes
const userRoutes = require("./routes/userRoutes")
const authenticataionRoutes = require("./routes/authenticationRoutes")
const { logError, handleError } = require("./errorsHandlers/errorHandlers");
const { deserializeUser } = require("./middlewares/deserializeUser");

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(deserializeUser)


app.get("/", async (req, res) => {
  const user = await prisma.user.findFirst()
  if (user) {
    res.send(`<h1>Hello ${user.username}</h1>`);
  }
  else {
    res.send('no user.')
  }
});


// Routes
app.use("/user", userRoutes)
app.use("/auth", authenticataionRoutes)
// app.use("/blog", userRoutes)


// Error handler
app.use(logError)

app.use(handleError)

// listening server
app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
