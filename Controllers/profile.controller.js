const { validationResult } = require("express-validator");
const {
  User,
  UserAdditionalInfo,
  Subscribers,
} = require("../Database/sequlize.js");
const { generateAccessToken, decodedDataFunc } = require("../Func/AuthFunc.js");

class ProfileContoroller {
  // Получение всех юзеров
  async getUsers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }

      const user = await UserAdditionalInfo.findAll();

      return res.json({
        status: true,
        userData: user,
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }

  // Получение юзера по ID
  async getUsersID(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }
      const { slug } = req.params;

      const slugAsNumber = parseInt(slug, 10);
      let user = null;
      if (!isNaN(slugAsNumber)) {
        // Если slug действительно число
        user = await UserAdditionalInfo.findOne({
          where: { userId: slugAsNumber },
        });
      } else {
        // Если slug не число, а строка
        user = await UserAdditionalInfo.findOne({ where: { login: slug } });
      }

      if (user) {
        return res.json({
          status: true,
          userData: user,
        });
      } else {
        return res.json({
          status: false,
        });
      }
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
  // Редактирование профиля
  async editUsersInfo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }
      const authHeaderToken = req.headers.authorization.split(" ")[1];
      if (!authHeaderToken) {
        return res.json({
          status: false,
          error: "Проблема с токеном авторизации",
        });
      }
      // Получение ID из токена
      const { id } = decodedDataFunc(authHeaderToken);
      // Тело запроса
      const { login, name, surname, age, gender, description } = req.body;
      // Проверка ID
      const checkId = await UserAdditionalInfo.findOne({
        where: { userId: id },
      });

      if (checkId) {
        const result = {};
        if (login) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { login: login },
            {
              where: { userId: id },
            }
          );
          const updatedUser = await User.update(
            { login: login },
            {
              where: { id: id },
            }
          );
          if (updatedUserAdditionalInfo && updatedUser) {
            const token = generateAccessToken(id, login);
            if (token) {
              result.login = {
                token: token,
                updateLogin: true,
                login: login,
              };
            } else {
              result.login = {
                updateLogin: false,
              };
            }
          }
        }
        if (name) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { name: name },
            {
              where: { userId: id },
            }
          );
          if (updatedUserAdditionalInfo) {
            result.name = {
              status: true,
              name: name,
            };
          } else {
            result.name = {
              status: false,
            };
          }
        }
        if (surname) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { surname: surname },
            {
              where: { userId: id },
            }
          );
          if (updatedUserAdditionalInfo) {
            result.surname = {
              status: true,
              surname: surname,
            };
          } else {
            result.surname = {
              status: false,
            };
          }
        }
        if (age) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { age: age },
            {
              where: { userId: id },
            }
          );
          if (updatedUserAdditionalInfo) {
            result.age = {
              status: true,
              age: age,
            };
          } else {
            result.age = {
              status: false,
            };
          }
        }
        if (gender) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { gender: gender },
            {
              where: { userId: id },
            }
          );
          if (updatedUserAdditionalInfo) {
            result.gender = {
              status: true,
              gender: gender,
            };
          } else {
            result.gender = {
              status: false,
            };
          }
        }
        if (description) {
          const updatedUserAdditionalInfo = await UserAdditionalInfo.update(
            { Desc: description },
            {
              where: { userId: id },
            }
          );
          if (updatedUserAdditionalInfo) {
            result.description = {
              status: true,
              description: description,
            };
          } else {
            result.description = {
              status: false,
            };
          }
        }

        return res.json({
          result: result,
        });
      }
      return res.json({
        result: false,
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }

  // Подписка
  async subscribeUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
      }
      const authHeaderToken = req.headers.authorization.split(" ")[1];
      if (!authHeaderToken) {
        return res.json({
          status: false,
          error: "Проблема с токеном авторизации",
        });
      }
      // Получение ID из токена
      const { id } = decodedDataFunc(authHeaderToken);
      // Проверка ID
      const checkUserId = await UserAdditionalInfo.findOne({
        where: { userId: id },
      });
      // Тело запроса
      const { userID } = req.body;
      const checkSubUserId = await UserAdditionalInfo.findOne({
        where: { userId: userID },
      });

      if (checkUserId && checkSubUserId) {
        // Проверка существующей подписки
        const existingSubscription = await Subscribers.findOne({
          where: {
            userId: id,
            subId: userID,
          },
        });

        if (existingSubscription) {
          return res.status(400).json({
            error: "Вы уже подписаны на этого пользователя.",
          });
        }
        // Подписка
        const user = await Subscribers.create({
          userId: id,
          subId: userID,
        });

        return res.json({
          status: true,
        });
      }
      return res.json({
        status: false,
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }

  // Отписка
  async unsubscribeUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка: ${e.msg}`));
      }
      const authHeaderToken = req.headers.authorization.split(" ")[1];
      if (!authHeaderToken) {
        return res.json({
          status: false,
          error: "Проблема с токеном авторизации",
        });
      }
      // Получение ID из токена
      const { id } = decodedDataFunc(authHeaderToken);
      // Проверка ID
      const checkUserId = await UserAdditionalInfo.findOne({
        where: { userId: id },
      });
      // Тело запроса
      const { userID } = req.body;
      const checkSubUserId = await UserAdditionalInfo.findOne({
        where: { userId: userID },
      });

      if (checkUserId && checkSubUserId) {
        // Проверка существующей подписки
        const existingSubscription = await Subscribers.findOne({
          where: {
            userId: id,
            subId: userID,
          },
        });

        if (existingSubscription) {
          // Удаление существующей подписки
          await Subscribers.destroy({
            where: {
              userId: id,
              subId: userID,
            },
          });

          return res.json({
            status: true,
            message: "Вы успешно отписались от пользователя.",
          });
        }

        return res.status(404).json({
          status: false,
          error: "Подписка не найдена.",
        });
      }
      return res.status(400).json({
        status: false,
        error: "Неверный идентификатор пользователя.",
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
  async checkSubscribe(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка: ${e.msg}`));
      }
      const authHeaderToken = req.headers.authorization.split(" ")[1];
      if (!authHeaderToken) {
        return res.json({
          status: false,
          error: "Проблема с токеном авторизации",
        });
      }
      // Получение ID из токена
      const { id } = decodedDataFunc(authHeaderToken);
      // Проверка ID
      const checkUserId = await UserAdditionalInfo.findOne({
        where: { userId: id },
      });
      // Тело запроса
      const { userID } = req.body;
      const checkSubUserId = await UserAdditionalInfo.findOne({
        where: { userId: userID },
      });

      if (checkUserId && checkSubUserId) {
        // Проверка существующей подписки
        const existingSubscription = await Subscribers.findOne({
          where: {
            userId: id,
            subId: userID,
          },
        });

        if (existingSubscription) {
          return res.json({
            status: true,
            subscribed: true,
            message: "Пользователь подписан.",
          });
        }

        return res.json({
          status: true,
          subscribed: false,
          message: "Подписка не найдена.",
        });
      }
      return res.status(400).json({
        status: false,
        error: "Неверный идентификатор пользователя.",
      });
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }

  // Получение подписок
  // async getSubscriptions(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json(errors.errors.map((e, index) => `${index}. Ошибка: ${e.msg}`));
  //     }

  //     const { userID, customization } = req.body;

  //     // Проверка существования пользователя
  //     const checkUserId = await UserAdditionalInfo.findOne({
  //       where: { userId: userID },
  //     });

  //     if (!checkUserId) {
  //       return res.status(400).json({
  //         status: false,
  //         error: "Неверный идентификатор пользователя.",
  //       });
  //     }

  //     if (customization === "number") {
  //       // Запрос количества подписок
  //       const subscriptionCount = await Subscribers.count({
  //         where: { userId: userID },
  //       });

  //       return res.json({
  //         status: true,
  //         count: subscriptionCount,
  //       });
  //     } else if (customization === "users") {
  //       // Запрос подписок
  //       const subscriptions = await Subscribers.findAll({
  //         where: { userId: userID },
  //       });

  //       if (subscriptions.length === 0) {
  //         return res.json({
  //           status: true,
  //           subscribers: [],
  //         });
  //       }

  //       // Получение информации о подписках
  //       const subscriptionIds = subscriptions.map((sub) => sub.subId);
  //       const subscriptionInfo = await UserAdditionalInfo.findAll({
  //         where: { userId: subscriptionIds },
  //       });

  //       return res.json({
  //         status: true,
  //         subscribers: subscriptionInfo,
  //       });
  //     } else {
  //       return res.status(400).json({
  //         status: false,
  //         error: "Неверное значение параметра customization.",
  //       });
  //     }
  //   } catch (e) {
  //     console.log(`Ошибка: ${e.message}`);
  //     return res.status(400).json(`Ошибка: ${e.message}`);
  //   }
  // }
  async getSubscriptions(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка: ${e.msg}`));
      }
  
      const { slug, customization } = req.body;
  
      // Проверка существования пользователя
      let checkUser;
      if (isNaN(slug)) {
        // Если slug не является числом, ищем по login
        checkUser = await UserAdditionalInfo.findOne({
          where: { login: slug },
        });
      } else {
        // Если slug является числом, ищем по userId
        checkUser = await UserAdditionalInfo.findOne({
          where: { userId: slug },
        });
      }
  
      if (!checkUser) {
        return res.status(400).json({
          status: false,
          error: "Неверный идентификатор пользователя.",
        });
      }
  
      const userID = checkUser.userId;
  
      if (customization === "number") {
        // Запрос количества подписок
        const subscriptionCount = await Subscribers.count({
          where: { userId: userID },
        });
  
        return res.json({
          status: true,
          count: subscriptionCount,
        });
      } else if (customization === "users") {
        // Запрос подписок
        const subscriptions = await Subscribers.findAll({
          where: { userId: userID },
        });
  
        if (subscriptions.length === 0) {
          return res.json({
            status: true,
            subscribers: [],
          });
        }
  
        // Получение информации о подписках
        const subscriptionIds = subscriptions.map((sub) => sub.subId);
        const subscriptionInfo = await UserAdditionalInfo.findAll({
          where: { userId: subscriptionIds },
        });
  
        return res.json({
          status: true,
          subscribers: subscriptionInfo,
        });
      } else {
        return res.status(400).json({
          status: false,
          error: "Неверное значение параметра customization.",
        });
      }
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
  // Полученеи подписчиков
  async getSubscribers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(errors.errors.map((e, index) => `${index}. Ошибка: ${e.msg}`));
      }
  
      const { slug, customization } = req.body;
  
      if (!slug) {
        return res.status(400).json({
          status: false,
          error: "Отсутствует параметр slug.",
        });
      }
  
      // Проверка существования пользователя
      let checkUser;
      if (isNaN(slug)) {
        // Если slug не является числом, ищем по login
        checkUser = await UserAdditionalInfo.findOne({
          where: { login: slug },
        });
      } else {
        // Если slug является числом, ищем по userId
        checkUser = await UserAdditionalInfo.findOne({
          where: { userId: slug },
        });
      }
  
      if (!checkUser) {
        return res.status(400).json({
          status: false,
          error: "Неверный идентификатор пользователя.",
        });
      }
  
      const userID = checkUser.userId;
  
      if (customization === "number") {
        // Запрос количества подписчиков
        const subscriberCount = await Subscribers.count({
          where: { subId: userID },
        });
  
        return res.json({
          status: true,
          count: subscriberCount,
        });
      } else if (customization === "users") {
        // Запрос подписчиков
        const subscribers = await Subscribers.findAll({
          where: { subId: userID },
        });
  
        if (subscribers.length === 0) {
          return res.json({
            status: true,
            subscribers: [],
          });
        }
  
        // Получение информации о подписчиках
        const subscriberIds = subscribers.map((sub) => sub.userId);
        const subscriberInfo = await UserAdditionalInfo.findAll({
          where: { userId: subscriberIds },
        });
  
        return res.json({
          status: true,
          subscribers: subscriberInfo,
        });
      } else {
        return res.status(400).json({
          status: false,
          error: "Неверное значение параметра customization.",
        });
      }
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
      return res.status(400).json(`Ошибка: ${e.message}`);
    }
  }
}
module.exports = new ProfileContoroller();
