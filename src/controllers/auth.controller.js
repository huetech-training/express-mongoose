
const bcrypt = require('bcrypt');
const userModel = require('../model/user');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt.helper');
module.exports = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({username});
      if (!user) {
        throw createError.Unauthorized('username/password invalid');
      }
      if (await bcrypt.compare(password, user.password)) {
        const token = await signAccessToken(user.username);
        const refreshToken = await signRefreshToken(user.username);
        res.send({ username: user.username, token, refreshToken });
      } else {
        throw createError.Unauthorized('username/password invalid');
      }
    } catch(err) {
      next(err);
    }
  },
  
  refreshToken: async (req, res, next) => {
    next();
  }
}
