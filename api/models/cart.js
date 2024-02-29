const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: String,
  icon: String,
});
const lodestoneSchema = new Schema({
    id: Number,
    name: String,
    avatar: String,
    rank: roleSchema,
  });
  
module.exports = mongoose.model('lodestone', lodestoneSchema);