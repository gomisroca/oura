const mongoose = require('mongoose');
const { Schema } = mongoose;

const colorSchema = new Schema({
  name: String,
  class: String
});


module.exports = mongoose.model('colors', colorSchema);