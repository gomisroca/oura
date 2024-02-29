const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoriesSchema = new Schema({
  genre: String,
  header: String,
  url: String,
  classes: [Object],
});


module.exports = mongoose.model('categories', categoriesSchema);