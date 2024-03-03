const express = require('express')
const router = express.Router()
const categoriesModel = require('../models/categories')
const Categories = require('../data/categories.json')

router.get('/catalog', async(req, res) => {
    try{
        const allCategories = await categoriesModel.find();
        if(allCategories){
            res.json(allCategories);
        } else{
            axios.get(`${process.env.API_URL}/categories/fetch`)
            .then(() => {
                if (res.status === 200) {
                    res.json(res.data);
                }
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response);
                }
            })
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

router.get('/fetch', async(req, res) => {
    try{
        Categories.forEach((category) => {
            const newCategories = new categoriesModel({
                genre: category.genre,
                header: category.header,
                url: category.url,
                classes: category.classes
            });
            newCategories.save();
        });
        const allCategories = await categoriesModel.find();
        res.status(200).json(allCategories);
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

module.exports = router
