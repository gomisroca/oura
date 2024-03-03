const express = require('express')
const router = express.Router()
const clothesModel = require('../models/clothes')
const Clothes = require('../data/clothes.json')

router.get('/catalog', async(req, res) => {
    try{
        const allClothes = await clothesModel.find()
        if(allClothes){
            res.json(allClothes);
        } else{
            axios.get(`${process.env.API_URL}/clothes/fetch`)
            .then(() => {
                if (res.status === 200) {
                    res.json(res.data);
                }
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                }
            })
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

router.get('/fetch', async(req, res) => {
    try{
        const allClothes = await clothesModel.find()
        Clothes.forEach((product) => {
            const matchingProduct = allClothes.find(doc => doc.id === product.id);
            if (matchingProduct){
                matchingProduct.title = product.title;
                matchingProduct.price = product.price;
                matchingProduct.description = product.description;
                matchingProduct.genre = product.genre;
                matchingProduct.class = product.class;
                matchingProduct.type = product.type;
                matchingProduct.image = product.image;
                matchingProduct.sale = product.sale;
                matchingProduct.sizes = product.sizes;
                if(!matchingProduct.sales){
                    matchingProduct.sales = product.sales;
                }
                if(product.seasonal){
                    matchingProduct.seasonal = product.seasonal;
                }
                matchingProduct.save();
            } else {
                const newProduct = new clothesModel({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    genre: product.genre,
                    class: product.class,
                    type: product.type,
                    image: product.image,
                    sale: product.sale,
                    sizes: product.sizes,
                    sales: product.sales
                });
                if(product.seasonal){
                    newProduct.seasonal = product.seasonal;
                }
                newProduct.save();
            }
        })
        const refreshedClothes = await clothesModel.find()
        res.status(200).json(refreshedClothes)
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

router.post('/update', async(req,res) => {
    try{
        for(let i = 0; i < req.body.length; i++){
            const product = await clothesModel.findOne({id: req.body[i].id});
            if(req.body[i].chosenColor){
                let color = product.sizes[req.body[i].chosenSize].find(color => color.colorName == req.body[i].chosenColor);
                color.amount -= 1;
            }
            product.sales += 1;
            product.save();
        }
        res.json('Clothes Updated')
    }catch(err){
        res.status(500).json({message: err.message})
    }  
})

router.get('/item/:id', async(req, res) => {
    try{
        const product = await clothesModel.findOne({ id: req.params.id });
        res.json(product)
    }catch(err){
        res.status(500).json({message: err.message})
    }   
})

module.exports = router
