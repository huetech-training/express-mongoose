
const bcrypt = require('bcrypt');
const userModel = require('../model/user');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken,verifyRefreshToken } = require('../helpers/jwt.helper');
module.exports = {
  register: async(req,res,next)=>{
    const {name,email,phone,password} = req.body;
    try{
      if(name && email && phone && password){
        const salt=await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password,salt);
        const user = userModel({name,email,phone,hashPassword})
        const foundUser = await userModel.findOne({email});
        if(foundUser){
          res.status(409).send(createError.Conflict('Email is already exists'));
        }
        await user.save() 
        res.status(201).send({
          code:201,
          message:'User is created'
        });       
      }
    }catch(err){
      res.status(500).send({statusCode:500,errorMessage:err})
    }
  },
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
