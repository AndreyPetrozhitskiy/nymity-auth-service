// MIDDLEWARE для полей при редактировании


const { User } = require("../Database/sequlize.js");
const { decodedDataFunc } = require("../Func/AuthFunc.js");
const { allowedFields } = require("../config.js");
module.exports = async function (req, res, next) {
  try {
    const extraFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
       
      return res
        .status(400)
        .json({ status:false,errors: `Недопустимые поля: ${extraFields.join(", ")}` });
    }
    next();
  } catch (e) {
    return res.status(401).json({ status: false, error: e });
  }
};
