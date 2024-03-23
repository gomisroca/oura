import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
        const homepageSettings = await prisma.homepageSettings.findMany({});
        res.json(200).json(homepageSettings);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})
// Set Homepage Settings
router.post('/homepage', async(req: Request, res: Response) => {
    try{
       
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
