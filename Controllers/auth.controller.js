const { validationResult } = require("express-validator");
const { User, UserAdditionalInfo } = require("../Database/sequlize.js");
const {
  generateAccessToken,
  decodedDataFunc,
  generateKeySecret,
} = require("../Func/AuthFunc.js");

class AuthContoroller {
  //   Регистрация нового пользователя
  async createNewUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }
      const {
        login,
        password,
        email,
        name,
        surname,
        age,
        gender,
        interests = [],
      } = req.body;

      const existingUser = await User.findOne({ where: { login } });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }
      // сохранение нового юзера в бд
      const user = await User.create({
        login,
        password,
      });

      const userId = user.dataValues.id;

      if (userId) {
        await UserAdditionalInfo.create({
          userId,
          email,
          login,
          name,
          surname,
          age,
          gender,
        });
      }
      const token = generateAccessToken(userId, login);

      return res.status(201).json({
        status: true,
        message: "Пользователь зарегистрирован",
        token: token,
        id: userId,
        login: login,
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
  // Авторизация
  async loginUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }

      const { login, password } = req.body;

      const existingUser = await User.findOne({ where: { login } });

      if (existingUser) {
        const checkPassword = await User.findAll({
          where: {
            login,
            password,
          },
        });
        if (checkPassword.length > 0) {
          const { id, login, password } = checkPassword[0].dataValues;

          const token = generateAccessToken(id, login);
          if (token) {
            return res.status(201).json({
              status: true,
              token: token,
              id: id,
              login: login,
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "Ошибка при создании токена ",
            });
          }
        } else {
          return res
            .status(400)
            .json({ status: false, message: "Введен неправильный пароль" });
        }
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Пользователь не зарегестрирован" });
      }
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }

  // Проверка токена
  async tokenCheck(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(400)
          .json({ status: false, message: "Пользователь не авторизован" });
      }

      const tokenArray = authHeader.split(" ");
      if (tokenArray.length !== 2 || tokenArray[0] !== "Bearer") {
        return res
          .status(400)
          .json({ status: false, message: "Неверный формат токена" });
      }

      const token = tokenArray[1];
      if (!token) {
        return res
          .status(400)
          .json({ status: false, message: "Пользователь не авторизован " });
      }
      const decodedData = decodedDataFunc(token);

      if (decodedData) {
        const id = decodedData.id;

        const checkUser = await User.findAll({ where: { id } });

        if (checkUser.length > 0) {
          return res.status(201).json({
            status: true,
            login: checkUser[0].dataValues.login,
            id: checkUser[0].dataValues.id,
          });
        }
      }

      return res
        .status(400)
        .json({ status: false, message: `Пользователь с id ${id} не найден` });
    } catch (e) {
      return res.status(401).json({ status: false, error: "Невалидный токен" });
    }
  }
  // Новый секретный ключ
  // async generationKey(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
  //     }
  //     generateKeySecret();
  //     return res.json({ Result: "Ключ создан" });
  //   } catch (e) {
  //     console.log(`Ошибка: ${e.message}`);
  //     return res.status(400).json(`Ошибка: ${e.message}`);
  //   }
  // }
}
module.exports = new AuthContoroller();
