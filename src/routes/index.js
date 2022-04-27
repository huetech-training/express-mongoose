const express = require('express');
const createError = require('http-errors');
const productRouter = require('./product.route');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');

router = express.Router();
router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

router.use((req, res, next) => {
  next(createError.NotFound())
})

router.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

module.exports = router;
