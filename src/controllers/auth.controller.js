
const bcrypt = require('bcrypt');
const userModel = require('../model/user');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken,verifyRefreshToken } = require('../helpers/jwt.helper');
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
    try{
      const body=req.body;
      if(!body || !body.refreshToken || !body.username){
          res.send(401).send(createError.Unauthorized('Not Allowed'))
      }
      const verifyToken= await verifyRefreshToken(body.refreshToken);
      if(verifyToken.flag){
        const user=await userModel.findOne({username});
      }else{
        throw createError.Unauthorized("Refresh Token not valid");
      }
      next();

    }catch(err){
      res.send(500).send(err);
    }
  }
}
