const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema({
    name: String,
    types: [String],
});

const categoriesSchema = new Schema({
    genre: String,
    header: String,
    classes: [classSchema],
});


module.exports = mongoose.model('categories', categoriesSchema);