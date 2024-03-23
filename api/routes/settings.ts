import express, { Request, Response } from 'express';
const router = express.Router();
import { HomepageSettings, PrismaClient } from '@prisma/client';
import multer, { FileFilterCallback } from 'multer';
const prisma = new PrismaClient();
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

// Get Category Settings
router.get('/categories', async(req: Request, res: Response) => {
    try{
       const categorySettings = await prisma.categorySettings.findMany({});
       res.json(200).json(categorySettings);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})
// Set Category Settings
router.post('/categories', async(req: Request, res: Response) => {
    try{
       
    }catch(err: unknown){
        res.status(500).json({message: err})
    }
})

// Get Homepage Settings
router.get('/homepage', async(req: Request, res: Response) => {
    try{
        const settings: HomepageSettings[] = await prisma.homepageSettings.findMany({});
        if(settings[0]){
            res.status(200).json(settings[0]);
        } else{
            res.status(404).json('SETTINGS_404');
        }
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})
// Set Homepage Settings
router.post('/homepage',
upload.fields([{ name: 'media', maxCount: 1 }]), 
async(req: Request, res: Response) => {
    try{
        // we get categories as a string, so we make them into an array
        const categories: string[] = req.body.categories.split(',')

        // image upload
        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
        const url = req.protocol + '://' + req.get('host');
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};

        let media: string[] = [];
        for (let i = 0; i < files['media'].length; i++) {
            let result: any = (files['media'][i].filename).match(imageReg);
            const uuid = uuidv4();
            media.push(url + '/public/homepage/' + uuid + result[0]);
            fs.move('./public/temp/' + files['media'][i].filename, './public/homepage/' + uuid + result[0], 
            function (err: unknown) {
                if (err) {
                    return console.error(err);
                }
            });
        }

        const settings: HomepageSettings[] = await prisma.homepageSettings.findMany({});
        // if settings exist and we uploaded a new pic, we remove the old one, otherwise we just update the categories
        if(settings[0]){
            if(files.media.length > 0){  
                const regex = /\/([^\/]+)$/;
                const match = settings[0].image.match(regex);
                if (match) {
                    const imagePath = match[1];
                    const imageUrl ='./public/homepage/' + imagePath;
                    fs.unlink(imageUrl, (err: any) => {
                        if(err){
                            console.error(err.message);
                            return;
                        }
                    });
                }
            }
            await prisma.homepageSettings.update({
                where: {
                    id: settings[0].id
                },
                data:{
                    categories: categories,
                    image: media[0],
                }
            })
        } else{
            // if settings doesn't exist, we simply create it
            await prisma.homepageSettings.create({
                data: {
                    categories: categories,
                    image: media[0],
                }
            })
        }
        res.sendStatus(201);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }
})

// Get Navbar Settings
router.get('/navigation', async(req: Request, res: Response) => {
    try{
        const navigationSettings = await prisma.navbarSettings.findMany({});
        res.json(200).json(navigationSettings);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }
})
// Set Navbar Settings
router.post('/navigation', async(req: Request, res: Response) => {
    try{

    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})

module.exports = router
