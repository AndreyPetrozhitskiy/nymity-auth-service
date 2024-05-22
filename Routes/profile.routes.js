const Router = require("express");
const profileContoroller = require("../Controllers/profile.controller");
const { check } = require("express-validator");
const router = new Router();
const JWTmiddleware = require("../Middlewares/jwt.middleware");
const allowFieldsMiddleware = require("../Middlewares/allowFields.middleware");

// Получение списка всех пользователей
router.get("/getUsers", profileContoroller.getUsers);

// Получение конкретного пользовтеля по ID
router.get("/getUsers/:slug", profileContoroller.getUsersID);

// Редактирование пользователя
router.put(
  "/editUsersInfo",
  JWTmiddleware,
  allowFieldsMiddleware,
  profileContoroller.editUsersInfo
);

// Подписка
router.post(
  "/subscribeUser",
  [check("userID", "userID не может быть пустым").notEmpty()],
  JWTmiddleware,
  profileContoroller.subscribeUser
);

// Отписка
router.post(
  "/unsubscribeUser",
  [check("userID", "userID не может быть пустым").notEmpty()],
  JWTmiddleware,
  profileContoroller.unsubscribeUser
);

// Проверка на подписку
router.post(
  "/checkSubscribe",
  [check("userID", "userID не может быть пустым").notEmpty()],
  JWTmiddleware,
  profileContoroller.checkSubscribe
);

// Получение подписок
router.get(
  "/getSubscriptions",
  [
    check("userID", "userID не может быть пустым").notEmpty(),
    check("customization", "customization не может быть пустым").notEmpty(),
  ],
  profileContoroller.getSubscriptions
);

// Получение подписчиков
router.get(
  "/getSubscribers",
  [
    check("userID", "userID не может быть пустым").notEmpty(),
    check("customization", "customization не может быть пустым").notEmpty(),
  ],
  profileContoroller.getSubscribers
);

module.exports = router;
