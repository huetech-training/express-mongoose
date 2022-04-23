const express = require('express');
const productRouter = require('./product.route');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');

router = express.Router();
router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;
