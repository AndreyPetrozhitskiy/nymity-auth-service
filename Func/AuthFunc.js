const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const cipherData = fs.readFileSync(path.join(__dirname, "../key.json"));
const { key, algorithm } = JSON.parse(cipherData);
const crypto = require("crypto");

const generateAccessToken = (id, login) => {
  try{
    console.log(key)
    if (key) {
      
      return jwt.sign({ id, login }, key, { expiresIn: "72h" });
    } else {
      console.error("AuthFunc.JS . Проблема с ключом шифрования");
    }
  } catch (e) {
    console.log(e.message)
  }
  
};
const decodedDataFunc = (token) => {
  if (key) {
    try {
      return jwt.verify(token, key);
    } catch (e) {
      console.log(`Ошибка: ${e.message}`);
    }
  } else {
    console.error("AuthFunc.JS . Проблема с ключом шифрования");
  }
};

const generateKeySecret = () => {
  const keyFilePath = path.join(__dirname, "../key.json");
  fs.writeFileSync(keyFilePath, JSON.stringify({ key, algorithm }));
};

module.exports.generateKeySecret = generateKeySecret;
module.exports.generateAccessToken = generateAccessToken;
module.exports.decodedDataFunc = decodedDataFunc;
