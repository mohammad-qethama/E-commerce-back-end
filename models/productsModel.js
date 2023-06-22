const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter product name'] },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  img: { type: String },
  price: { type: Number, required: [true, 'Please enter product price'] },
  category: { type: String, required: [true, 'Please enter product category'] },
  comments: { type: Array, default: [] },
  rating: { type: Object, default: { number: 0, rate: 0 } },
});

module.exports = mongoose.model('Product', productSchema);
