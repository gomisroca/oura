const express = require('express')
const router = express.Router()
const categoriesModel = require('../models/categories')

router.get('/catalog', async(req, res) => {
    try{
        const allCategories = await categoriesModel.find();
        res.json(allCategories);
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

module.exports = router
