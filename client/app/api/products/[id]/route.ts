import prisma from "@/utils/db";
import { Prisma, Product, ProductSize, SizeColor } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import { verifyUser } from "@/utils/auth";
import { handleImageUpload } from "@/utils/image-upload";

interface PartialSizeColor{
    name: string;
    amount: number;
}
interface PartialSize{
    size: string;
}
type ProductWithSizes = Prisma.ProductGetPayload<{
    include: { sizes: { include: { colors: true } } }
}>
type SizeWithColors = Prisma.ProductSizeGetPayload<{
    include: { colors: true }
}>

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try{
        const product: Product | null = await prisma.product.findUnique({
            where: {
                id: params.id
            },
            include: {
                sizes: {
                    include: {
                        colors: true,
                    }
                }
            }
        })
        if(product){
            return NextResponse.json(product, { status: 200 });
        } 
        return NextResponse.json('PRODUCT_404', { status: 404 })
    } catch(err: unknown){
        return NextResponse.json({message: err}, { status: 500 })
    } finally {
        await prisma.$disconnect();
    } 
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try{
        const user = verifyUser(req.headers)
        if(user && user.role !== 'BASIC'){
            const formData = await req.formData();            
            const type = 'products';
            const name = formData.get('name') as string;
            const price = formData.get('price');
            const description = formData.get('description') as string;
            const addSizes = formData.get('addSizes');
            const stock = formData.get('stock');
            const gender = formData.get('gender') as string;
            const category = formData.get('category') as string;
            const subcategory = formData.get('subcategory') as string;
            const sales = formData.get('sales');
            const onSale = formData.get('onSale');
            const onSeasonal = formData.get('onSeasonal');

            // Get Product
            const product: ProductWithSizes | null = await prisma.product.findUnique({ 
                where: {
                    id: params.id,
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
                // Image File Handling
                const image_file: File | null = formData.get("image") as File;
                if (image_file) {
                    const image = await handleImageUpload(image_file, type)
                    if(product?.image){
                        fs.unlink(product.image, (err: any) => {
                            if(err){
                                console.error(err.message);
                                return;
                            }
                        });
                    }
                    await prisma.product.update({ 
                        where: {
                            id: product.id,
                        },
                        data: {
                            image: image
                        },
                    });
                }
                
                // Update basic product info
                await prisma.product.update({ 
                    where: {
                        id: product.id,
                    },
                    data: {
                        name: name,
                        description: description,
                        gender: gender.toLowerCase(),
                        category: category.toLowerCase(),
                        subcategory: subcategory.toLowerCase(),
                        price: Number(price),
                        sales: Number(sales),
                        totalStock: Number(stock),
                        onSale: onSale === 'true',
                        onSeasonal: onSeasonal === 'true'
                    },
                });

                // If addSizes is unchecked, we delete any Sizes the product had
                if (addSizes == 'false'){
                    await prisma.productSize.deleteMany({
                        where: {
                            productId: product.id
                        }
                    })
                } else {
                    // Size and Color Handling
                    const sizes = formData.get('sizes') as string;
                    const colors = formData.get('colors') as string;
                    
                    let splitSizes: string[] | undefined = sizes?.split(',');
                    let splitColors: string[] | undefined = colors?.split(',');

                    let colorStock: number | undefined = Number(stock) / (splitColors!.length * splitSizes!.length);
                    
                    const newSizes: string[] = [];
                    // If the updated product has sizes, we iterate over them
                    for(const size of splitSizes){
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
                            for(const color of splitColors){
                                // if the color doesn't exist in the size, we put them in the array to be added later
                                const existingColor: SizeColor | null = await prisma.sizeColor.findFirst({
                                    where: {
                                        sizeId: existingSize.id,
                                        name: color
                                    }
                                })
                                if(!existingColor){
                                    newColors.push(color);
                                } else{
                                    await prisma.sizeColor.update({
                                        where: {
                                            id: existingColor.id,
                                        },
                                        data: {
                                            amount: colorStock
                                        }
                                    })
                                }
                            }
                            // we add the new colors to the size
                            if(newColors.length > 0){
                                const colorInputs: PartialSizeColor[] = newColors.map((name) => ({
                                    name,
                                    amount: colorStock,
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
                                            in: splitColors
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
                        const colorInputs: PartialSizeColor[] = splitColors.map((name) => ({
                            name,
                            amount: colorStock,
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
                                    in: splitSizes as string[]
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
                return NextResponse.json('No Product', { status: 404 })
            }
            return NextResponse.json({ status: 200 })
        }
        return NextResponse.json('No Auth', { status: 403 })
    } catch(err: unknown){
        return NextResponse.json({message: err}, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try{
        const product: Product | null = await prisma.product.findUnique({
            where: {
                id: params.id
            }
        })
        if(product){
            await prisma.product.delete({ 
                where: {
                    id: params.id,
                }
            });
            if(product.image){
                fs.rm(product.image, { recursive: true }, (err: any) => {
                    if(err){
                        console.error(err.message);
                        return;
                    }
                });
            }
            return NextResponse.json({ status: 200 })
        }
        return NextResponse.json('PRODUCT_404', { status: 404 })
    } catch(err: unknown){
        return NextResponse.json({message: err}, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }  
}