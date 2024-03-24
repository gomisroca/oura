import express, { Request, Response } from 'express';
const router = express.Router()

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyBasicToken, verifyAdminToken } = require('../middleware/auth');

import { AuthedRequest, ProductWithSizes } from '../index';
import { Order, PrismaClient, ProductSize, Role, SizeColor, User } from '@prisma/client'
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
    role: Role;
    new_password?: string;
}

router.get("/", verifyAdminToken, async (req: AuthedRequest, res: Response) => {
    try{
        const users: User[] = await prisma.user.findMany({});
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

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

        if(req.body.role){
            await prisma.user.update({ 
                where: {
                    id: user.id,
                },
                data: { 
                    role: req.body.role 
                }
            });
        }
        
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
                res.status(403).send("INVALID_CREDENTIALS");
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

router.get("/info", verifyBasicToken, async (req: AuthedRequest, res: Response) => {
    if(req.user){
        res.status(200).json(req.user);
    } else {
        res.status(403).json('INVALID_CREDENTIALS')
    }
});

async function createOrder(userId: string) {
    try {
      // Create order with no products initially
      const order: Order = await prisma.order.create({
        data: {
          userId: userId,
        },
      });
  
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
    }
}

async function addProductToOrder(orderId: string, productId: string) {
    try {
        // Add product to the order
        const orderProduct = await prisma.orderProduct.create({
            data: {
                orderId: orderId,
                productId: productId
            },
        });
        console.log('Product added to order:', orderProduct);
    } catch (error) {
        console.error('Error adding product to order:', error);
    }
}

router.post("/purchase", verifyBasicToken, async (req: AuthedRequest, res: Response) => {
    try{
        const orderId: string | undefined = await createOrder(req.user!.id);
        for (const item of req.body){
           const product: ProductWithSizes | null = await prisma.product.findUnique({ 
                where: {
                    id: item.id,
                },
                include: {
                    sizes: {
                        include: {
                            colors: true,
                        }
                    } 
                }
            });

            if(product && orderId){
                if(item.color && product.sizes){
                    const chosenSize = product.sizes.find((size: ProductSize) => size.size == item.size);
                    const chosenColor = (chosenSize?.colors.find((color: SizeColor) => color.name == item.color))
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
                        id: item.id,
                    },
                    data: {
                        sales: {
                            increment: 1
                        }
                    },
                });
                
                await addProductToOrder(orderId, product.id);
            } else{
                res.status(404).json('PRODUCT_404')
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
});

router.get("/orders", verifyBasicToken, async (req: AuthedRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: req.user!.id
            }
        })

        res.json(orders)
    } catch (err) {
        console.log(err);
    }
});

router.get("/:id", verifyAdminToken, async (req: AuthedRequest, res: Response) => {
    try{
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (user){
            res.status(200).json(user);
        } else{
            res.status(404).json('USER_404')
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

router.post("/:id", verifyBasicToken, async (req: AuthedRequest, res: Response) => {
    try{
        const { firstName, lastName, email, role, new_password }: UpdateInputs = req.body;
        console.log(req.body)
        const user: User | null = await prisma.user.findUnique({ 
            where: {
                id: req.params.id
            },
        })
        
        if(user){
            if(req.user!.id !== user.id && req.user!.role !== 'ADMIN'){
                return res.status(403).json({ message: 'INVALID_CREDENTIALS'});
            }
            if(firstName.toLowerCase() !== user.firstName.toLowerCase()){
                user.firstName = firstName;
            }
            if(lastName !== user.lastName.toLowerCase()){
                user.lastName = lastName;
            }
            if(email.toLowerCase() !== user.email.toLowerCase()){
                user.email = email.toLowerCase();
            } 
            if(role !== user.role){
                user.role = role as Role;
            }
            if(new_password){
                let encryptedPassword: string = await bcrypt.hash(new_password, 10);
                user.password = encryptedPassword;
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
            res.status(403).json('INVALID_CREDENTIALS')
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
});

router.delete('/:id', verifyBasicToken, async(req: AuthedRequest, res: Response) => {
    try{
        const user: User | null = await prisma.user.findUnique({ 
            where: {
                id: req.params.id,
            },
        })
        
        if(user){
            if(req.user!.id !== user.id && req.user!.role !== 'ADMIN'){
                return res.status(403).json({ message: 'INVALID_CREDENTIALS'});
            }
            await prisma.user.delete({ 
                where: {
                    id: req.params.id,
                }
            });
            res.sendStatus(200);
        }
    } catch(err: unknown){
        res.status(500).json({message: err})
    } finally {
        await prisma.$disconnect();
    }  
});

module.exports = router;