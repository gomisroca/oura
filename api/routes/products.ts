import express, { Request, Response } from 'express';
const router = express.Router()
import multer, { FileFilterCallback } from 'multer';
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

import { AuthedRequest } from '../index';
const verifyToken = require('../middleware/auth');
import { Prisma, PrismaClient, Product, ProductSize, SizeColor } from '@prisma/client';
const prisma = new PrismaClient();

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

interface ProductInputs {
    name: string;
    description: string;
    price: number;
    stock: number;
    gender: string;
    category: string;
    subcategory: string;
    addSizes: boolean;
}

type ProductWithSizes = Prisma.ProductGetPayload<{
    include: { sizes: { include: { colors: true } } }
}>

router.get('/', async(req: Request, res: Response) => {
    try{
        const allProducts: Product[] | null = await prisma.product.findMany({
            include: {
                sizes: {
                    include: {
                        colors: true,
                    }
                }
            }
        })
        if(allProducts){
          res.status(200).json(allProducts);
        } else{
          res.status(404).json('CATALOG_404')
        }
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    } 
})

// Upload
router.post('/', 
verifyToken,
upload.fields([{ name: 'media', maxCount: 1 }]),
async(req: AuthedRequest, res: Response) => {
    try{
        if(req.user?.role !== 'BASIC'){
            const {name, description, price, stock, gender, category, subcategory, addSizes}: ProductInputs = req.body;

            const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
            const url = req.protocol + '://' + req.get('host');

            const colors = [
                {
                    amount: Number(stock),
                    name: "black"
                },
                {
                    amount: Number(stock),
                    name: "white"
                },
                {
                    amount: Number(stock),
                    name: "red"
                },
                {
                    amount: Number(stock),
                    name: "orange"
                },
                {
                    amount: Number(stock),
                    name: "yellow"
                },
                {
                    amount: Number(stock),
                    name: "blue"
                },
                {
                    amount: Number(stock),
                    name: "purple"
                },
                {
                    amount: Number(stock),
                    name: "green" 
                },
            ];

            const product: Product = await prisma.product.create({ 
                data: { 
                    name: name,
                    price: Number(price),
                    description: description,
                    gender: gender,
                    category: category,
                    subcategory: subcategory
                }
            });

            if(addSizes){
                const productWithSize: ProductWithSizes = await prisma.product.update({ 
                    where: {
                        id: product.id,
                    },
                    data: {
                        sizes: {
                            createMany: ({
                                data: [
                                    {size: 'XS'},
                                    {size: 'S'},
                                    {size: 'M'},
                                    {size: 'L'},
                                    {size: 'XL'},
                                    {size: 'XXL'},
                                ]
                            })
                        }
                    },
                    include: {
                        sizes: {
                            include: {
                                colors: true
                            }
                        }
                    }
                })
                for(const size of productWithSize.sizes){
                    await prisma.productSize.update({ 
                        where: {
                            id: size.id,
                        },
                        data: {
                            colors: {
                                createMany: ({
                                    data: colors
                                })
                            }
                        },
                        include: {
                            colors: true,
                        }
                    })
                }
            }

            let media = [];
            const files = req.files as {[fieldname: string]: Express.Multer.File[]};

            for (let i = 0; i < files['media'].length; i++) {
                let result: any = (files['media'][i].filename).match(imageReg);
                const uuid = uuidv4();
                media.push(url + '/public/' + product.id + '/media/' + uuid + result[0]);
                fs.move('./public/temp/' + files['media'][i].filename, './public/' + product.id + '/media/' + uuid + result[0], 
                function (err: unknown) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }

            const finalProduct: ProductWithSizes = await prisma.product.update({ 
                where: {
                    id: product.id,
                },
                data: {
                    image: media[0]
                },
                include: {
                    sizes: {
                        include: {
                            colors: true
                        }
                    }
                }
            })
            console.log(finalProduct)

            res.status(201).json(finalProduct)
        } else{
            res.status(400).send("INVALID_CREDENTIALS");
        }
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }
})

router.post('/update', async(req: Request, res: Response) => {
    try{
        for(let i = 0; i < req.body.length; i++){
            const product: ProductWithSizes | null = await prisma.product.findUnique({ 
                where: {
                    id: req.body[i].id,
                },
                include: {
                    sizes: {
                        include: {
                            colors: true,
                        }
                    } 
                }
            });

            if(product){
                if(req.body[i].color && product.sizes){
                    const chosenSize = product.sizes.find((size: ProductSize) => size.size == req.body[i].size);
                    const chosenColor = (chosenSize?.colors.find((color: SizeColor) => color.name == req.body[i].color))
                    if(chosenColor){
                        await prisma.sizeColor.update({
                            where: {
                                id: chosenColor.id,
                            },
                            data:{
                                amount: {
                                    decrement: 1
                                }
                            }
                        })
                    }
                }
                
                await prisma.product.update({ 
                    where: {
                        id: req.body[i].id,
                    },
                    data: {
                        sales: {
                            increment: 1
                        }
                    },
                });
            } else{
                res.status(404).json('PRODUCT_404')
            }
        }
        res.sendStatus(200)
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }
})

router.get('/:id', async(req: Request, res: Response) => {
    try{
        const product: Product | null = await prisma.product.findUnique({ 
            where: {
                id: req.params.id,
            },
            include: {
                sizes: {
                    include: {
                        colors: true,
                    }
                } 
            }
        })
        res.json(product)
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }  
})

module.exports = router
