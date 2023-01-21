const express = require("express");
const { register, login } = require("../controllers/Auth");
const router = express.Router();

// REGISTER
router.post("/register", register)


// LOGIN
router.post("/login", login)

module.exports = router;