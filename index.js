const express = require("express");
const fs = require("fs");
const cors = require("cors");
const https = require("https");
const dotenv = require("dotenv");
const { sequelize } = require("./Database/sequlize");
dotenv.config();
const { PORT } = process.env;

const authRouter = require("./Routes/auth.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

// SSL

// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/nymity.freemyip.com/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/nymity.freemyip.com/fullchain.pem",
//   "utf8"
// );

// const credentials = { key: privateKey, cert: certificate };
// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(PORT, () => {
//     console.log(`HTTPS Server running on port ${PORT}`);
// try {
//   await sequelize.authenticate();
//   console.log("Подключение к базе данных успешно");
// } catch (error) {
//   console.error("Не получилось подключиться к базе данных:", error);
// }
//   });


app.listen(PORT, async () => {
  console.log(`HTTPS Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных успешно");
  } catch (error) {
    console.error("Не получилось подключиться к базе данных:", error);
  }
});
