const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../model/user');

const router = express.Router();

router.post('/', async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const user = userModel({username: req.body.username, password: hashPassword});
      await user.save();
      res.status(201).send()
      // res.send({'password': req.body.password, salt, hashPassword});
    } catch (e) {
      res.status(500).send({errorCode: 2345, errorMessage: ''});
    }
  } else {
    res.status(400).send();
  }
});

router.get('/', async (req, res) => {
  const users = await userModel.find({})
  res.send(users);
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({errorCode: 111, errorMessage: "user id is missing."})
  }
  const users = await userModel.deleteOne({_id: req.params.id})
  res.status(204).send();
});




module.exports = router;