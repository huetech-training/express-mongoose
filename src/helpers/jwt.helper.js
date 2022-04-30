
const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) {
      return next(createError.Unauthorized())
    }
    const authHeaders = req.headers['authorization'];
    const token = authHeaders.split(' ')[1];
    JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
      if (err) {
        return next(createError.Unauthorized())
      }
      req.payload = payload;
      next();
    });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
          return reject(createError.Unauthorized(err.message))
        }
        return resolve(payload.email);
      }); 
    })
  },

  signAccessToken: (payload) => {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: '15s',
        issuer: 'hutech',
        audience: payload.email,
      }
      JWT.sign(payload, process.env.TOKEN_SECRET, options, (err, token) => {
        if(err) {
          return reject(createError.InternalServerError());
        }
        resolve(token);
      })
    });
  },

  signRefreshToken: (payload) => {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: '30d',
        issuer: 'hutech',
        audience: payload.email
      }
      JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, options, (err, token) => {
        if(err) {
          return reject(createError.InternalServerError());
        }
        resolve(token);
      })
    });
  }
}