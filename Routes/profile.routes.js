const Router = require("express");
const profileContoroller = require("../Controllers/profile.controller");
const { check } = require("express-validator");
const router = new Router();
const JWTmiddleware = require("../Middlewares/jwt.middleware");
router.get("/getUsers", profileContoroller.getUsers);
router.get("/getUsers/:slug", profileContoroller.getUsersID);

module.exports = router;
