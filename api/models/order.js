const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const orderSchema = new Schema({
  id: { type: String, default: uuidv4() },
  timestamp: { type: Date, default: Date.now() },
  user: { type: String, require: true },
  products: [String],
});
  
module.exports = mongoose.model('order', orderSchema);