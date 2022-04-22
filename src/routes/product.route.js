const express = require('express');
const router = express.Router();
const product = require('../model/product');

// get products
router.get('/', async (req, res) => {
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
