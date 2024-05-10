const Router = require("express");
const AuthContoroller = require("../Controllers/auth.controller");
const { check } = require("express-validator");
const router = new Router();
// const authMiddleware = require("../Middlewares/auth.middleware.js");

// Регистрация
router.post(
  "/registration",
  [
    // Доделать, обработка интересов interest
    check("login", "Логин не может быть пустым").notEmpty(),
    check("email", "Email не может быть пустым").notEmpty(),
    check("name", "Имя не может быть пустым").notEmpty(),
    check("surname", "Surname не может быть пустым").notEmpty(),
    check("password", "Пароль не может быть пустым").notEmpty(),
    check("age", "Возраст не может быть пустым").notEmpty(),
    check("gender", "Пол не может быть пустым").notEmpty(),
    check("interests", "Interests должны быть массивом").optional().isArray(),
  ],
  AuthContoroller.createNewUser
);
router.post(
  "/login",
  [
    check("login", "Логин не может быть пустым").notEmpty(),
    check("password", "Пароль не может быть пустым").notEmpty(),
  ],
  AuthContoroller.loginUser
);
// Проверка ткоена
router.get("/check", AuthContoroller.tokenCheck);
// Новый секретный ключ
// router.get("/newkey", AuthContoroller.generationKey); 
module.exports = router;
