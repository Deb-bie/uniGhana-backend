const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const PORT = process.env.PORT
const authRoute = require("./routes/Users.js");
const { connectDb } = require("./db/Db.js");


connectDb()
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api", authRoute)


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
});


app.listen(PORT, () => {
    console.log(`Server is listenning on PORT ${PORT} `)
})
