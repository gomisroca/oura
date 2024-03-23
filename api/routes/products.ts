import express, { Request, Response } from 'express';
const router = express.Router()
import multer, { FileFilterCallback } from 'multer';
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

import { AuthedRequest, ProductWithSizes, SizeWithColors } from '../index';
const { verifyEditorToken } = require('../middleware/auth');
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
    sizes?: string[];
    colors?: string[];
}

interface PartialSizeColor{
    name: string;
    amount: number;
}

interface PartialSize{
    size: string;
}

interface PartialProduct {
    name: string;
    description: string;
    image: string;
    gender: string;
    category: string;
    subcategory: string;
    addSizes: boolean;
    sizes?: string[];
    colors?: string[];
    price: number;
    stock: number;
    sales: number;
    onSale: boolean;
    onSeasonal: boolean;
}

// Fetch All
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
verifyEditorToken,
upload.fields([{ name: 'media', maxCount: 1 }]),
async(req: AuthedRequest, res: Response) => {
    try{
        if(req.user?.role !== 'BASIC'){
            const {name, description, price, stock, gender, category, subcategory, addSizes, sizes, colors}: ProductInputs = req.body;

            const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
            const url = req.protocol + '://' + req.get('host');

            // We add the basic data for the product
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

            // If product has sizes, we add the sizes it has and their colors with the given stock
            if(Boolean(addSizes) && sizes && colors){
                const sizeObjects: PartialSize[] = sizes.map(size => ({ size }));
                const productWithSize: ProductWithSizes = await prisma.product.update({ 
                    where: {
                        id: product.id,
                    },
                    data: {
                        sizes: {
                            createMany: ({
                                data: sizeObjects as ProductSize[]
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
                const colorInputs: PartialSizeColor[] = colors.map((name) => ({
                    name,
                    amount: Number(stock),
                }));
                for(const size of productWithSize.sizes){
                    await prisma.productSize.update({ 
                        where: {
                            id: size.id,
                        },
                        data: {
                            colors: {
                                createMany: ({
                                    data: colorInputs as SizeColor[]
                                })
                            }
                        },
                        include: {
                            colors: true,
                        }
                    })
                }
            }

            // We save the product image in the server
            let media: string[] = [];
            const files = req.files as {[fieldname: string]: Express.Multer.File[]};
            for (let i = 0; i < files['media'].length; i++) {
                let result: any = (files['media'][i].filename).match(imageReg);
                const uuid = uuidv4();
                media.push(url + '/public/' + product.id + '/' + uuid + result[0]);
                fs.move('./public/temp/' + files['media'][i].filename, './public/' + product.id + '/' + uuid + result[0], 
                function (err: unknown) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }

            // And attach the image to the product
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

// Get Single
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

// Update Single
router.post('/:id', 
// verifyEditorToken, 
upload.fields([{ name: 'media', maxCount: 1 }]),
async(req: Request, res: Response) => {
    try{
        const updatedProduct: PartialProduct = req.body;
        const product: ProductWithSizes | null = await prisma.product.findUnique({ 
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
        });
        
        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
        const url = req.protocol + '://' + req.get('host');


        if(product){
            const files = req.files as {[fieldname: string]: Express.Multer.File[]};
            let media: string[] = [];

            // If we are sending files...
            if(files.media.length > 0){
                // We remove the old image
                const regex = /\/([^\/]+)$/; // Match '/' followed by one or more characters that are not '/'
                const match = product.image.match(regex);

                if (match) {
                    const imagePath = match[1];
                    const productImageUrl ='./public/' + req.params.id + '/' + imagePath;
                    fs.unlink(productImageUrl, (err: any) => {
                        if(err){
                            console.error(err.message);
                            return;
                        }
                    });
                }
                
                // We add the new image to the product
                for (let i = 0; i < files['media'].length; i++) {
                    let result: any = (files['media'][i].filename).match(imageReg);
                    const uuid = uuidv4();
                    media.push(url + '/public/' + product.id + '/' + uuid + result[0]);
                    fs.move('./public/temp/' + files['media'][i].filename, './public/' + product.id + '/' + uuid + result[0], 
                    function (err: unknown) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            }

            // We update the basic product info
            await prisma.product.update({ 
                where: {
                    id: product.id,
                },
                data: {
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    image: media[0],
                    gender: updatedProduct.gender,
                    category: updatedProduct.category,
                    subcategory: updatedProduct.subcategory,
                    price: Number(updatedProduct.price),
                    sales: Number(updatedProduct.sales),
                    onSale: Boolean(updatedProduct.onSale),
                    onSeasonal: Boolean(updatedProduct.onSeasonal)
                },
            });

            // If addSizes is unchecked, we delete any Sizes the product had
            if (!Boolean(updatedProduct.addSizes)){
                await prisma.productSize.deleteMany({
                    where: {
                        productId: product.id
                    }
                })
            } else if (updatedProduct.sizes && updatedProduct.colors) {
                const newSizes: string[] = [];
                // If the updated product has sizes, we iterate over them
                for(const size of updatedProduct.sizes){
                    // we check if the size already exists
                    const existingSize: SizeWithColors | null = await prisma.productSize.findFirst({
                        where: {
                            productId: product.id,
                            size: size
                        },
                        include:{
                            colors: true,
                        }
                    })
                    
                    if(existingSize){
                        // if the size exists, we iterate over updated product colors
                        const newColors: string[] = [];
                        for(const color of updatedProduct.colors){
                            // if the color doesn't exist in the size, we put them in the array to be added later
                            const existingColor: SizeColor | null = await prisma.sizeColor.findFirst({
                                where: {
                                    sizeId: existingSize.id,
                                    name: color
                                }
                            })
                            if(!existingColor){
                                newColors.push(color);
                            }
                        }
                        // we add the new colors to the size
                        if(newColors.length > 0){
                            const colorInputs: PartialSizeColor[] = newColors.map((name) => ({
                                name,
                                amount: Number(updatedProduct.stock),
                            }));
                            await prisma.productSize.update({ 
                                where: {
                                    id: existingSize.id,
                                },
                                data: {
                                    colors: {
                                        createMany: ({
                                            data: colorInputs as SizeColor[]
                                        })
                                    }
                                }
                            })
                        }
                        // and we remove from the size the colors that are not in the updated product
                        const unusedColors = await prisma.sizeColor.findMany({
                            where: {
                                NOT: {
                                    name: {
                                        in: updatedProduct.colors
                                    }
                                }
                            }
                        })

                        for (const color of unusedColors) {
                            await prisma.sizeColor.delete({
                                where: {
                                    id: color.id,
                                },
                            });
                        }

                    } else{
                        // if the size doesn't exist, we push it to the array to be added later
                        console.log(12)
                        newSizes.push(size)
                    }
                }
                // we add the new sizes
                if(newSizes.length > 0){
                    const sizeObjects: PartialSize[] = newSizes.map(size => ({ size }));
                    const productWithSize: ProductWithSizes = await prisma.product.update({ 
                        where: {
                            id: product.id,
                        },
                        data: {
                            sizes: {
                                createMany: ({
                                    data: sizeObjects as ProductSize[]
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
                    // we add the color data to the new sizes
                    const colorInputs: PartialSizeColor[] = updatedProduct.colors.map((name) => ({
                        name,
                        amount: Number(updatedProduct.stock),
                    }));

                    for(const size of productWithSize.sizes){
                        for(const colorInput of colorInputs) {
                            const existingColor: SizeColor | undefined = size.colors.find((color: SizeColor) => color.name === colorInput.name);
                            if(!existingColor){
                                await prisma.productSize.update({ 
                                    where: {
                                        id: size.id,
                                    },
                                    data: {
                                        colors: {
                                            createMany: ({
                                                data: colorInput as SizeColor
                                            })
                                        }
                                    },
                                    include: {
                                        colors: true,
                                    }
                                })
                            }
                        }
                    }
                }
                // and we remove the sizes that are not in the updated product
                const unusedSizes = await prisma.productSize.findMany({
                    where: {
                        NOT: {
                            size: {
                                in: updatedProduct.sizes as string[]
                            }
                        }
                    }
                })

                for (const size of unusedSizes) {
                    await prisma.productSize.delete({
                        where: {
                            id: size.id,
                        },
                    });
                }
            }
        } else{
            res.status(404).json('PRODUCT_404')
        }
        res.sendStatus(200)
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }
})

// Delete Single
router.delete('/:id',
verifyEditorToken,
async(req: AuthedRequest, res: Response) => {
    try{
        await prisma.product.delete({ 
            where: {
                id: req.params.id,
            }
        });  
        const productUrl ='./public/' + req.params.id;
        fs.rm(productUrl, { recursive: true }, (err: any) => {
            if(err){
                console.error(err.message);
                return;
            }
        });
        res.sendStatus(200);
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }  
})

module.exports = router
