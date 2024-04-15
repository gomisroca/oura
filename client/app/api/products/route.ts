import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { Prisma, Product, ProductSize, SizeColor } from "@prisma/client";
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

export async function GET(req: NextRequest) {
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
            console.log(allProducts)
            return NextResponse.json(allProducts, { status: 200 });
        } else{
            return NextResponse.json('CATALOG_404', { status: 404 })
        }
    } catch(err: unknown){
        return NextResponse.json({message: err}, { status: 500 })
    } finally {
        await prisma.$disconnect();
    } 
};

export async function POST(req: NextRequest) {
    try{  
        const user = verifyUser(req.headers)
        if(user && user.role !== 'BASIC'){
            const formData = await req.formData();

            // Get all data from the form
            const type = 'products';
            const name = formData.get('name') as string;
            const price = formData.get('price');
            const description = formData.get('description') as string;
            const addSizes = formData.get('addSizes');
            const stock = formData.get('stock');
            const gender = formData.get('gender') as string;
            const category = formData.get('category') as string;
            const subcategory = formData.get('subcategory') as string;

            // Create initial product
            const product: Product = await prisma.product.create({ 
                data: { 
                    name: name,
                    price: Number(price),
                    description: description,
                    totalStock: Number(stock),
                    gender: gender.toLowerCase(),
                    category: category.toLowerCase(),
                    subcategory: subcategory.toLowerCase()
                }
            });

            // Size and Color Handling
            let colorStock: number;
            let splitSizes: string[] = [];
            let splitColors: string[] = [];
            if(addSizes == 'true'){
                const sizes = formData.get('sizes') as string;
                const colors = formData.get('colors') as string;
                splitSizes = sizes!.split(',');
                splitColors = colors!.split(',');
                colorStock = Number(stock) / (splitColors!.length * splitSizes!.length); 
                // If we actually have Sizes and Colors
                if(splitSizes.length > 0 && splitColors.length > 0){
                    const sizeObjects: PartialSize[] = splitSizes.map(size => ({ size }));
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
                    const colorInputs: PartialSizeColor[] = splitColors.map((name) => ({
                        name,
                        amount: colorStock,
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
            }
            
            // Image File Handling
            const image_file: File | null = formData.get("image") as File;
            if (image_file) {
                const image = await handleImageUpload(image_file, type)
                const finalProduct: ProductWithSizes = await prisma.product.update({ 
                    where: {
                        id: product.id,
                    },
                    data: {
                        image: image
                    },
                    include: {
                        sizes: {
                            include: {
                                colors: true
                            }
                        }
                    }
                })
                return NextResponse.json(finalProduct, { status: 200 })
            } else{
                const finalProduct: Product | null = await prisma.product.findUnique({ 
                    where: {
                        id: product.id,
                    },
                    include: {
                        sizes: {
                            include: {
                                colors: true,
                            }
                        } 
                    }
                })
                return NextResponse.json(finalProduct, { status: 200 })
            }
        }
        return NextResponse.json('No Auth', { status: 403 })
    } catch(err: unknown){
        return NextResponse.json({message: err}, { status: 500 })
    } finally {
        await prisma.$disconnect();
    } 
};