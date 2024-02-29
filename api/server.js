console.log("current Environment " + process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}
const DATABASE_URL  = process.env.DATABASE_URL;
const express = require('express')
const app = express ()
const mongoose = require('mongoose')
const cors = require ('cors')

var corsOptions = {
    credentials: true,
    origin: ['http://127.0.0.1:4000', 'http://localhost:4000']
}

app.use(cors(corsOptions)) 

//db
mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.log('db error'))
db.once('open', (success) => console.log('db loaded'))

app.use(express.json())

// Routers
const clothesRouter = require('./routes/clothes');
app.use('/clothes', clothesRouter);
const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);
const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.get('/', async (req, res) => {
    res.json('hi')
})
app.listen(4030, () => console.log('OURA Server Running'));


module.exports = { 
    db: mongoose.connection 
  };