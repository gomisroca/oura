const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const colorSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  class: { type: String, required: true }
});

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: true
  },
  colors: [colorSchema]
});

const clothesSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sale: { type: Number, default: null },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  class: { type: String, required: true },
  type: { type: String, required: true },
  seasonal: { type: Boolean, default: false },
  image: { type: String, required: true },
  sizes: [sizeSchema],
  sales: { type: Number, default: 0 }
});


module.exports = mongoose.model('clothes', clothesSchema);