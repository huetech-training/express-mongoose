
const bcrypt = require('bcrypt');
const userModel = require('../model/user');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt.helper');
module.exports = {
  register: async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    try {
      if (name && email && password) {
        const foundUser = userModel.findOne({email})
        if (foundUser) {
          throw createError.Conflict('email already taken.');
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const user = userModel({name, email, phone, password: hashPassword});
        await user.save();
        res.status(201).send()   
      } else {
        throw createError.BadRequest('')
      }
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({email}).exec();
      if (!user) {
        throw createError.Unauthorized('username/password invalid');
      }
      if (await bcrypt.compare(password, user.password)) {
        const payload = { email }
        const token = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);
        user.token = refreshToken;
        await user.save();
        res.send({ email: user.email, token, refreshToken });
      } else {
        throw createError.Unauthorized('username/password invalid');
      }
    } catch(err) {
      next(err);
    }
  },
  
  refreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) {
        throw createError.BadRequest('refresh token is required')
      }
      const email = await verifyRefreshToken(refreshToken);
      if (!email) {
        throw createError.Unauthorized()
      }
      const foundUser = await userModel.findOne({email});
      if (foundUser && refreshToken === foundUser.token) {
        const payload = { email }
        const token = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);
        // foundUser.token = refreshToken;
        // await foundUser.save();
        res.send({ username: foundUser.email, token, refreshToken });
      } else {
        throw createError.Unauthorized()
      }
    } catch (error) {
      next(error);
    } 
  }
}
