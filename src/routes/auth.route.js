const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');

const router = express.Router();
const TOKEN_SECRET = '7b0243a47dc65b7c274d044d1dd4e3c12b7075f2c046ca49566e744e278b3112659a6a43cfdf2167437ba4b2e382c9523ddf52bcaa79ba600371cc9f04130959'

router.post('/login', async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      const user = await userModel.findOne({username: req.body.username});
      if (await bcrypt.compare(req.body.password, user.password)) {
        token = jwt.sign({username: user.username}, TOKEN_SECRET, {expiresIn: '20s'});
        res.send({username: user.username, token})
      } else {
        res.status(401).send();
      }
    } catch (e) {
      res.status(500).send({errorCode: 2345, errorMessage: ''});
    }
  } else {
    res.status(400).send({errorCode: 1001, errorMessage: 'username/passwrod are required.'});
  }
});

module.exports = router;