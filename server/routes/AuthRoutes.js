const express = require("express");
const router = express.Router();
const {register,login,profile,logout} = require('../controllers/AuthControllers')
const UserMiddleware = require('../middleware/UserMiddleware')

router.post("/register", register);
router.post("/login", login);
router.get("/profile",UserMiddleware, profile);
router.get("/logout",UserMiddleware,logout)

module.exports = router;