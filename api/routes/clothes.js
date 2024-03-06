const express = require('express')
const router = express.Router()
const clothesModel = require('../models/clothes')
const Clothes = require('../data/clothes.json')

const multer  = require('multer');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const DIR = './public/temp';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
});
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
});

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
        res.sendStatus(200)
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

// Upload
router.post('/', 
upload.fields([{ name: 'media', maxCount: 1 }]),
async(req,res) => {
    try{
        const product = req.body;
        const product_id = uuidv4();

        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
        const url = req.protocol + '://' + req.get('host');

        let media = [];
        for (let i = 0; i < req.files.media.length; i++) {
            let result = (req.files.media[i].filename).match(imageReg);
            const uuid = uuidv4();
            media.push(url + '/public/' + product_id + '/media/' + uuid + result[0]);
            fs.move('./public/temp/' + req.files.media[i].filename, './public/' + product_id + '/media/' + uuid + result[0], function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        }

        const sizes =  {
            "XS":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ],
            "S":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ],
            "M":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ],
            "L":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ],
            "XL":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ],
            "2XL":  [
              {
                "amount": 100,
                "colorName": "black",
                "colorClass": "bg-black"
              },
              {
                "amount": 100,
                "colorName": "white",
                "colorClass": "bg-white"
              },
              {
                "amount": 100,
                "colorName": "red",
                "colorClass": "bg-red-600"
              },
              {
                "amount": 100,
                "colorName": "orange",
                "colorClass": "bg-orange-600"
              },
              {
                "amount": 100,
                "colorName": "yellow",
                "colorClass": "bg-yellow-600"
              },
              {
                "amount": 100,
                "colorName": "blue",
                "colorClass": "bg-blue-600"
              },
              {
                "amount": 100,
                "colorName": "purple",
                "colorClass": "bg-purple-600"
              },
              {
                "amount": 100,
                "colorName": "green",
                "colorClass": "bg-green-600"
              }
            ]
        }
        
        const newProduct = new clothesModel({
            id: product_id,
            title: product.title,
            price: product.price,
            description: product.description,
            genre: product.genre,
            class: product.class,
            type: product.type,
            image: media[0]
        });
        if(product.sale){
            newProduct.sale = product.sale;
        }
        if(product.class !== 'accessory'){
            newProduct.sizes = sizes;
        }
        if(product.seasonal){
            newProduct.seasonal = product.seasonal;
        }
        newProduct.save();

        res.status(201).json(newProduct)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router
