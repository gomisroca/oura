console.log("current Environment " + process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}
const DATABASE_URL  = process.env.DATABASE_URL;
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

//db
mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL)
const db = mongoose.connection
db.on('error', (error: unknown) => console.log('DB Error: ' + error))
db.once('open', (_success: unknown) => console.log('DB On'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/public', express.static('public'));

// Routers
const clothesRouter = require('./routes/clothes');
app.use('/clothes', clothesRouter);
const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);
const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.listen(4030, () => console.log('API Server On'));

module.exports = { 
    db: mongoose.connection 
  };