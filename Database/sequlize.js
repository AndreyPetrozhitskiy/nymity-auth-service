const { Sequelize, DataTypes } = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();
const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// Модель для таблицы Users
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Определение полей модели
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальное значение
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель для таблицы UserAdditionalInfo
const UserAdditionalInfo = sequelize.define("UserAdditionalInfo", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Уникальное значение
  },
  Desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальное значение
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Модель для таблицы Interests
const Interest = sequelize.define("Interest", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальное значение
  },
});

// Модель для таблицы Server
const Server = sequelize.define("Server", {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальное значение
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель для таблицы Subscribers
const Subscribers = sequelize.define(
  "Subscribers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserAdditionalInfo,
        key: "userId",
      },
    },
    subId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserAdditionalInfo,
        key: "userId",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "subId"],
      },
    ],
  }
);

// Связь между таблицами Users и UserAdditionalInfo
User.hasOne(UserAdditionalInfo, {
  foreignKey: "userId",
});
UserAdditionalInfo.belongsTo(User, {
  foreignKey: "userId",
});

// Связь между таблицами UserAdditionalInfo и Subscribers для userId
UserAdditionalInfo.hasMany(Subscribers, {
  foreignKey: "userId",
});
Subscribers.belongsTo(UserAdditionalInfo, {
  foreignKey: "userId",
});

// Связь между таблицами UserAdditionalInfo и Subscribers для subId
UserAdditionalInfo.hasMany(Subscribers, {
  foreignKey: "subId",
});
Subscribers.belongsTo(UserAdditionalInfo, {
  foreignKey: "subId",
});

// Синхронизация с базой данных и создание таблиц, если их нет
sequelize
  .sync()
  .then(() => {
    console.log("All tables have been synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to synchronize tables:", err);
  });

// Экспорт моделей для использования в других модулях
module.exports = {
  User,
  UserAdditionalInfo,
  Interest,
  Server,
  Subscribers,
  sequelize,
};
