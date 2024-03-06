const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const colorSchema = new Schema({
  amount: Number,
  colorName: String,
  colorClass: String,
})

const sizeSchema = new Schema({
  XS: [colorSchema],
  S: [colorSchema],
  M: [colorSchema],
  L: [colorSchema],
  XL: [colorSchema],
  XXL: [colorSchema]
})

const clothesSchema = new Schema({
  id: { type: String, default: uuidv4() },
  title: String,
  price: Number,
  sale: Number,
  description: String,
  genre: String,
  class: String,
  type: String,
  seasonal: { type: Boolean, default: false },
  image: String,
  sizes: sizeSchema,
  sales: { type: Number, default: 0 },
});


module.exports = mongoose.model('clothes', clothesSchema);