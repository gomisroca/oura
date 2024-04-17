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
            const gender = formData.get('gender');
            const category = formData.get('category');
            const subcategory = formData.get('subcategory');


            let genderArray: string[] = [];
            if(gender){
                genderArray = JSON.parse(gender as string);
                genderArray = genderArray.map(x => x.toLowerCase())
            }

            let categoryArray: string[] = [];
            if(category){
                categoryArray = JSON.parse(category as string);
                categoryArray = categoryArray.map(x => x.toLowerCase())
                console.log(categoryArray[0])
            }

            let subcategoryArray: string[] = [];
            if(subcategory){
                subcategoryArray = JSON.parse(subcategory as string);
                subcategoryArray = subcategoryArray.map(x => x.toLowerCase())
            }

            const product: Product = await prisma.product.create({ 
                data: { 
                    name: name,
                    price: Number(price),
                    description: description,
                    totalStock: Number(stock),
                    gender: genderArray,
                    category: categoryArray,
                    subcategory: subcategoryArray
                }
            });
            console.log(product)

            // Size and Color Handling
            let colorStock: number;
            if(addSizes == 'true'){
                const sizes = formData.get('sizes');
                let sizesArray: string[] = [];
                if(sizes){
                    sizesArray = JSON.parse(sizes as string);
                    sizesArray = sizesArray.map(x => x.toUpperCase())
                }

                const colors = formData.get('colors');
                let colorsArray: string[] = [];
                if(colors){
                    colorsArray = JSON.parse(colors as string);
                    colorsArray = colorsArray.map(x => x.toLowerCase())
                }

                colorStock = Number(stock) / (colorsArray.length * sizesArray.length); 
                // If we actually have Sizes and Colors
                if(sizesArray.length > 0 && colorsArray.length > 0){
                    const sizeObjects: PartialSize[] = sizesArray.map(size => ({ size }));
                    console.log(sizeObjects)
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
                    const colorInputs: PartialSizeColor[] = colorsArray.map((name) => ({
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