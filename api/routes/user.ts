import express, { Request, Response } from 'express';
const router = express.Router()

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/auth');

import { AuthedRequest } from '../index';
import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient();

interface RegisterInputs {
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string;
}

interface LoginInputs {
    email: string; 
    password: string;
    keepAlive: boolean
}

interface UpdateInputs{
    firstName: string; 
    lastName: string; 
    email: string; 
    old_password?: string;
    new_password?: string;
}

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password }: RegisterInputs = req.body;
        
        if (!(email && password && firstName && lastName)) {
            res.status(400).send("All input is required");
        }
 
        const existingUser: User | null = await prisma.user.findUnique({ 
            where: {
                email: email.toLowerCase(),
            },
        })
        if (existingUser) {
            return res.status(409).send("USER_EXISTS");
        }
    
        //Encrypt user password
        let encryptedPassword: string = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user: User = await prisma.user.create({ 
            data: { 
                firstName: firstName,
                lastName: lastName,
                email: email.toLowerCase(),
                password: encryptedPassword 
            }
        });
        console.log(user)
        let access_token: string = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                role: user.role  
            },
            process.env.TOKEN_KEY
        );
    
        res.status(201).json(access_token);
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});


router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password, keepAlive }: LoginInputs = req.body;

        if (!(email && password)) {
            res.status(400).send("INVALID_INPUT");
        } else {
            const user: User | null = await prisma.user.findUnique({ 
                where: {
                    email: email.toLowerCase(),
                },
            });
            console.log(user)

            let isPassValid: boolean = await bcrypt.compare(password, user?.password);

            if (user && isPassValid) {
                let access_token: string;
                if (keepAlive == true) {
                    access_token = jwt.sign(
                        { 
                            id: user.id, 
                            email: user.email, 
                            firstName: user.firstName, 
                            lastName: user.lastName, 
                            role: user.role  
                        },
                        process.env.TOKEN_KEY
                    );
                    
                } else {
                    access_token = jwt.sign(
                        { 
                            id: user.id, 
                            email: user.email, 
                            firstName: user.firstName, 
                            lastName: user.lastName, 
                            role: user.role 
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                }
                res.status(200).json(access_token);
            } else {
                res.status(400).send("INVALID_CREDENTIALS");
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

router.get("/info", verifyToken, async (req: AuthedRequest, res: Response) => {
    if(req.user){
        res.status(200).json(req.user);
    } else {
        res.status(401).json('INVALID_CREDENTIALS')
    }
});

// router.post("/purchase", verifyToken, async (req: AuthedRequest, res: Response) => {
//     try{        
//         let product_ids = [];
//         for (const item of req.body){
//            product_ids.push(item.id);
//         }

//         await Order.create({
//             user: req.user?.id,
//             products: product_ids
//         });

//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err);
//     }
// });

// router.get("/orders", verifyToken, async (req: AuthedRequest, res: Response) => {
//     try {
//         const allOrders = await Order.find();
//         const allClothes = await Clothes.find();

//         const matchingOrders = allOrders.find((order: any) => order.user === req.user?.id);
//         const matchingProducts = [];

//         for (const product of matchingOrders.products) {
//             let matchingClothes = allClothes.find((item: any)=> item.id == product);
//             matchingProducts.push(JSON.stringify(matchingClothes))
//         }

//         matchingOrders.products = matchingProducts
//         res.json([matchingOrders])
//     } catch (err) {
//         console.log(err);
//     }
// });

router.post("/update", verifyToken, async (req: AuthedRequest, res: Response) => {
    try{
        const { firstName, lastName, email, old_password, new_password }: UpdateInputs = req.body;

        const user: User | null = await prisma.user.findUnique({ 
            where: {
                email: email.toLowerCase(),
            },
        })

        if(user){
            if(firstName.toLowerCase() !== user.firstName.toLowerCase()){
                user.firstName = firstName;
            }
            if(lastName !== user.lastName.toLowerCase()){
                user.lastName = lastName;
            }
            if(email.toLowerCase() !== user.email.toLowerCase()){
                user.email = email.toLowerCase();
            }
            if(old_password && new_password){
                let isPassValid: boolean = await bcrypt.compare(old_password, user.password);
                if(isPassValid){
                    let encryptedPassword: string = await bcrypt.hash(new_password, 10);
                    user.password = encryptedPassword;
                } else {
                    return res.status(401).json(`INVALID_INPUT`)
                }
            }

            const updatedUser: User = await prisma.user.update({ 
                where: {
                    email: email.toLowerCase(),
                },
                data: user,
            })

            let access_token: string = jwt.sign(
                { 
                    id: updatedUser.id, 
                    email: updatedUser.email, 
                    firstName: updatedUser.firstName, 
                    lastName: updatedUser.lastName, 
                    role: updatedUser.role 
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );
            res.status(200).json(access_token);
        } else{
            res.status(401).json('INVALID_CREDENTIALS')
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;