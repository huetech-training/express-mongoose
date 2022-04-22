  const mongoose = require('mongoose');

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
      default: 0.0,
    },

    featured: {
      type: Boolean,
      required: false,
      default: false,
    }
  });

  module.exports = mongoose.model('product', productSchema);
  