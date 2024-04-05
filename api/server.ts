console.log("current Environment " + process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}
import express from 'express';
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');

var corsOptions = {
    credentials: true,
    origin: process.env.CLIENT_URL
}

app.use(cors(corsOptions)) 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/public', express.static('public'));

// Routers
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);
const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const settingsRouter = require('./routes/settings');
app.use('/settings', settingsRouter);

app.listen(4030, () => console.log('API Server On'));