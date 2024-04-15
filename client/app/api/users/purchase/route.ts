import { verifyUser } from "@/utils/auth";
import prisma from "@/utils/db";
import { Order, Prisma, ProductSize, SizeColor } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type ProductWithSizes = Prisma.ProductGetPayload<{
    include: { sizes: { include: { colors: true } } }
}>

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

export async function POST(req: NextRequest) {
    try {
        const user = verifyUser(req.headers);
        const order = await req.json();
        if(user){
            const orderId: string | undefined = await createOrder(user.id);
            for (const item of order){
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
                            },
                            totalStock:{
                                decrement: 1
                            }
                        },
                    });
                    
                    await addProductToOrder(orderId, product.id);
                } else{
                    return NextResponse.json('NO_PRODUCT', { status: 404 })
                }
            }
            return NextResponse.json({ status: 200 })
        } else{
            return NextResponse.json('NO_USER', { status: 403 })
        }
    } catch (err) {
        console.log(err);
    }
}