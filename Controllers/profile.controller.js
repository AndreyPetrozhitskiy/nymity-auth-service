const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { User, UserAdditionalInfo } = require("../Database/sequlize.js");
const {
  generateAccessToken,
  decodedDataFunc,
  generateKeySecret,
} = require("../Func/AuthFunc.js");

class ProfileContoroller {
  //   Регистрация нового пользователя
  // Новый секретный ключ
  async getUsers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }

      const user = await UserAdditionalInfo.findAll();
      console.log(user)
      // console.log(user.dataValues)
      return res.json({
        status: true,
        userData: user,
      });
      // if (user.dataValues) {
       
      // }
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
}
module.exports = new ProfileContoroller();
