const app = require('./app');
const config = require('./config/config');

const mongoose = require('mongoose');
let server;
mongoose.connect(config.mongodb.connectString, { useNewUrlParser: true})
.then(() => {
  console.log('Connected to Mongo DB');
  server = app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
});

process.on('uncaughtException', () => {
  console.log('Exception....');
});
