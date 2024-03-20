import express, { Request, Response } from 'express';
const router = express.Router()
const clothesModel = require('../models/clothes')
const categoriesModel = require('../models/categories')
import multer, { FileFilterCallback } from 'multer';
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const DIR = './public/temp';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
      cb(null, DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
});
let upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed.'));
      }
    }
});

router.get('/catalog', async(req: Request, res: Response) => {
    try{
        const allClothes = await clothesModel.find()
        res.json(allClothes);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})

router.post('/update', async(req: Request, res: Response) => {
    try{
        for(let i = 0; i < req.body.length; i++){
            const product = await clothesModel.findOne({id: req.body[i].id});
            if(req.body[i].chosenColor){
                let color = product.sizes[req.body[i].chosenSize].find((color: any) => color.name == req.body[i].chosenColor);
                color.amount -= 1;
            }
            product.sales += 1;
            product.save();
        }
        res.sendStatus(200)
    }catch(err: unknown){
        res.status(500).json({message: err})
    }  
})

router.get('/item/:id', async(req: Request, res: Response) => {
    try{
        const product = await clothesModel.findOne({ id: req.params.id });
        res.json(product)
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})

// Upload
router.post('/', 
upload.fields([{ name: 'media', maxCount: 1 }]),
async(req: Request, res: Response) => {
    try{
        const product = req.body;
        const product_id = uuidv4();

        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
        const url = req.protocol + '://' + req.get('host');

        let media = [];
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};

        for (let i = 0; i < files['media'].length; i++) {
            let result: any = (files['media'][i].filename).match(imageReg);
            const uuid = uuidv4();
            media.push(url + '/public/' + product_id + '/media/' + uuid + result[0]);
            fs.move('./public/temp/' + files['media'][i].filename, './public/' + product_id + '/media/' + uuid + result[0], 
            function (err: unknown) {
                if (err) {
                    return console.error(err);
                }
            });
        }

        const sizes =  [
          {
            size: "XS",
            colors: [
              {
                "amount": 100,
                "name": "black",
                "class": "bg-black"
              },
              {
                "amount": 100,
                "name": "white",
                "class": "bg-white"
              },
              {
                "amount": 100,
                "name": "red",
                "class": "bg-red-600"
              },
              {
                "amount": 100,
                "name": "orange",
                "class": "bg-orange-600"
              },
              {
                "amount": 100,
                "name": "yellow",
                "class": "bg-yellow-600"
              },
              {
                "amount": 100,
                "name": "blue",
                "class": "bg-blue-600"
              },
              {
                "amount": 100,
                "name": "purple",
                "class": "bg-purple-600"
              },
              {
                "amount": 100,
                "name": "green",
                "class": "bg-green-600"
              }
            ]
          },
          {
            size: "S",  
            colors: [
            {
              "amount": 100,
              "name": "black",
              "class": "bg-black"
            },
            {
              "amount": 100,
              "name": "white",
              "class": "bg-white"
            },
            {
              "amount": 100,
              "name": "red",
              "class": "bg-red-600"
            },
            {
              "amount": 100,
              "name": "orange",
              "class": "bg-orange-600"
            },
            {
              "amount": 100,
              "name": "yellow",
              "class": "bg-yellow-600"
            },
            {
              "amount": 100,
              "name": "blue",
              "class": "bg-blue-600"
            },
            {
              "amount": 100,
              "name": "purple",
              "class": "bg-purple-600"
            },
            {
              "amount": 100,
              "name": "green",
              "class": "bg-green-600"
            }
            ]
          },
          {
            size: "M",
            colors: [
            {
              "amount": 100,
              "name": "black",
              "class": "bg-black"
            },
            {
              "amount": 100,
              "name": "white",
              "class": "bg-white"
            },
            {
              "amount": 100,
              "name": "red",
              "class": "bg-red-600"
            },
            {
              "amount": 100,
              "name": "orange",
              "class": "bg-orange-600"
            },
            {
              "amount": 100,
              "name": "yellow",
              "class": "bg-yellow-600"
            },
            {
              "amount": 100,
              "name": "blue",
              "class": "bg-blue-600"
            },
            {
              "amount": 100,
              "name": "purple",
              "class": "bg-purple-600"
            },
            {
              "amount": 100,
              "name": "green",
              "class": "bg-green-600"
            }
            ],
          },
          {
            size: "L",
            colors: [
            {
              "amount": 100,
              "name": "black",
              "class": "bg-black"
            },
            {
              "amount": 100,
              "name": "white",
              "class": "bg-white"
            },
            {
              "amount": 100,
              "name": "red",
              "class": "bg-red-600"
            },
            {
              "amount": 100,
              "name": "orange",
              "class": "bg-orange-600"
            },
            {
              "amount": 100,
              "name": "yellow",
              "class": "bg-yellow-600"
            },
            {
              "amount": 100,
              "name": "blue",
              "class": "bg-blue-600"
            },
            {
              "amount": 100,
              "name": "purple",
              "class": "bg-purple-600"
            },
            {
              "amount": 100,
              "name": "green",
              "class": "bg-green-600"
            }
            ]
          },
          {
            size: "XL",
            colors: [
            {
              "amount": 100,
              "name": "black",
              "class": "bg-black"
            },
            {
              "amount": 100,
              "name": "white",
              "class": "bg-white"
            },
            {
              "amount": 100,
              "name": "red",
              "class": "bg-red-600"
            },
            {
              "amount": 100,
              "name": "orange",
              "class": "bg-orange-600"
            },
            {
              "amount": 100,
              "name": "yellow",
              "class": "bg-yellow-600"
            },
            {
              "amount": 100,
              "name": "blue",
              "class": "bg-blue-600"
            },
            {
              "amount": 100,
              "name": "purple",
              "class": "bg-purple-600"
            },
            {
              "amount": 100,
              "name": "green",
              "class": "bg-green-600"
            }
            ]
          },
          {
            size: "2XL",
            colors: [
              {
                "amount": 100,
                "name": "black",
                "class": "bg-black"
              },
              {
                "amount": 100,
                "name": "white",
                "class": "bg-white"
              },
              {
                "amount": 100,
                "name": "red",
                "class": "bg-red-600"
              },
              {
                "amount": 100,
                "name": "orange",
                "class": "bg-orange-600"
              },
              {
                "amount": 100,
                "name": "yellow",
                "class": "bg-yellow-600"
              },
              {
                "amount": 100,
                "name": "blue",
                "class": "bg-blue-600"
              },
              {
                "amount": 100,
                "name": "purple",
                "class": "bg-purple-600"
              },
              {
                "amount": 100,
                "name": "green",
                "class": "bg-green-600"
              }
            ]
          }
        ]
        
        const newProduct = new clothesModel({
            id: product_id,
            name: product.product_name,
            price: product.price,
            description: product.description,
            genre: product.genre.toLowerCase(),
            class: product.class.toLowerCase(),
            type: product.type.toLowerCase(),
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

        
        const category = await categoriesModel.findOne({ genre: product.genre.toLowerCase() });

        if (category){
            let categoryClass = category.classes.find((e: any) => e.name.toLowerCase() == product.class.toLowerCase());
            if (!categoryClass){
                let newClasses: any = [];
                let newTypes = new Array(product.type.toLowerCase());
                let newClass = {
                    name: product.class.toLowerCase(),
                    types: newTypes
                }
                if(newClasses.filter((e: any) => e.name == newClass.name).length == 0){
                    console.log(1.1)
                    console.log(newClass)
                    newClasses.push(newClass)
                }
                category.classes.push(...newClasses);
                newClasses = [];
            } else{
                if (categoryClass.types.filter((e: any) => e == product.type.toLowerCase()).length == 0) {
                    categoryClass.types.push(product.type.toLowerCase())
                }
            }
            category.save();
        } else{
            let newTypes = new Array(product.type.toLowerCase());   

            let newClass = {
                name: product.class.toLowerCase(),
                types: newTypes
            };
            let newClassArray = new Array(newClass);

            let newCategory = new categoriesModel({
                genre: product.genre.toLowerCase(),
                header: "../../assets/sale.jpg",
                classes: newClassArray
            });

            newCategory.save();
        }


        res.status(201).json(newProduct)
    }catch(err: unknown){
        res.status(500).json({message: err})
    }
})

module.exports = router
