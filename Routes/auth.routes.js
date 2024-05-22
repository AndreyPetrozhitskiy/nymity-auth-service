const Router = require("express");
const AuthContoroller = require("../Controllers/auth.controller");
const { check } = require("express-validator");
const router = new Router();

// Регистрация
router.post(
  "/registration",
  [
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

// Авторизация
router.post(
  "/login",
  [
    check("login", "Логин не может быть пустым").notEmpty(),
    check("password", "Пароль не может быть пустым").notEmpty(),
  ],
  AuthContoroller.loginUser
);

// Проверка токена
router.get("/check", AuthContoroller.tokenCheck);

// Новый секретный ключ
// router.get("/newkey", AuthContoroller.generationKey); 

module.exports = router;
