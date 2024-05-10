const { User } = require("../Database/sequlize.js");
const { decodedDataFunc } = require("../Func/AuthFunc.js");
module.exports = async function (req, res, next) {
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
        next();
      }
    } else {
      return res.status(401).json({ status: false, error: "Невалидный токен" });
    }
  } catch (e) {
    return res.status(401).json({ status: false, error: "Невалидный токен" });
  }
};