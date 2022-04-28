
const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) {
      return next(createError.Unauthorize())
    }
    const authHeaders = req.headers['authorization'];
    const token = authHeaders.split(' ')[1];
    JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
          return next(createError.Unauthorize(errMsg))
        }
        req.payload = payload;
        next();
      });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
          return reject(createError.Unauthorize(errMsg))
        }
        const userId = payload.aud;
        const refreshTokenFromStorage = '';
        if (refreshToken !== refreshTokenFromStorage) {
          return reject(createError.Unauthorize(errMsg))
        }
        // verify against database
        resolve({status:'Success',flag:true,message:'Enter'});
      });
    })
  },

  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.TOKEN_SECRET;
      const options = {
        expiresIn: '15m',
        issuer: 'hutech',
        audience: userId
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if(err) {
          console.log(err);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      })
    });
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.TOKEN_SECRET;
      const options = {
        expiresIn: '30d',
        issuer: 'hutech',
        audience: userId
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if(err) {
          console.log(err);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      })
    });
  }
}