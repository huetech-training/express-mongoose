const express = require('express');
const router = express.Router();
const product = require('../model/product');
const jwt = require('jsonwebtoken');

const TOKEN_SECRET = '7b0243a47dc65b7c274d044d1dd4e3c12b7075f2c046ca49566e744e278b3112659a6a43cfdf2167437ba4b2e382c9523ddf52bcaa79ba600371cc9f04130959';

const authenticateToken = (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  console.log(authHeaders);
  const token = authHeaders.split(' ')[1];
  console.log(token)
  if (!token) {
    res.status(401).send()
  }
  jwt.verify(token, TOKEN_SECRET, (err, data) => {
    if (err || !data) {
      console.log(err)
      console.log(data)
      return res.status(401).send("adfadsfasd")
    }
    console.log(data);
    next();
  })
}

// get products
router.get('/', authenticateToken, async (req, res) => {
  products = await product.find();
  res.send(products);
});

// create product
router.post('/', (req, res) => {
  console.log(res.body);
  const data = product(req.body);
  data.save();
  res.send(req.body);
});

// update product
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const data = product(req.body);
  await product.updateOne({_id: id}, data);
  res.send(data);
});

// get featured products
router.get('/featured', async (req, res) => {
  const p = await product.find({featured: true})
  res.send(p);
});

// get product detail
router.get('/:id', async (req, res) => {
  console.log("Inside product detail")
  const p = await product.find({_id: req.params.id})
  res.send({});
});



module.exports = router;
