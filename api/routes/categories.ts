import express, { Request, Response } from 'express';
const router = express.Router()
const categoriesModel = require('../models/categories')

router.get('/catalog', async(req: Request, res: Response) => {
    try{
        const allCategories = await categoriesModel.find();
        res.json(allCategories);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})

module.exports = router
