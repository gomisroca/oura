'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { Cookies } from 'react-cookie';
import { getProducts } from "@/utils/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductSize, SizeColor } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProductUpload() {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [sizes, setSizes] = useState<ProductSize[]>();
    const [colors, setColors] = useState<SizeColor[]>();
    const [genders, setGenders] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [subcategories, setSubcategories] = useState<string[]>();
    const [addSizes, setAddSizes] = useState<boolean>(false);

    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

    const fetchCatalog = async() => {
        try{
            const data = await getProducts();
            if(data){
                let colorArray: SizeColor[] = [];
                let sizeArray: ProductSize[] = [];
                let genderArray: string[] = [];
                let categoryArray: string[] = [];
                let subcategoryArray: string[] = [];

                for(const product of data){
                    if (!genderArray.includes(product.gender.toLowerCase())){
                        genderArray.push(product.gender.toLowerCase())
                    }
                    if (!categoryArray.includes(product.category.toLowerCase())){
                        categoryArray.push(product.category.toLowerCase())
                    }
                    if (!subcategoryArray.includes(product.subcategory.toLowerCase())){
                        subcategoryArray.push(product.subcategory.toLowerCase())
                    }
                    for(const size of product.sizes){
                        const check = sizeArray.filter(x => x.size == size.size)
                        if (check.length == 0){
                            sizeArray.push(size)
                        }
                        for(const color of size.colors){
                            const check = colorArray.filter(x => x.name == color.name)
                            if (check.length == 0){
                                colorArray.push(color)
                            }
                        }
                    }
                }
                setColors(colorArray);
                setSizes(sizeArray);
                setGenders(genderArray);
                setCategories(categoryArray);
                setSubcategories(subcategoryArray);
            }
        } catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        fetchCatalog();
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
        }
        formData.append('name', form.p_name.value);
        formData.append('price', form.price.value);
        formData.append('description', form.description.value);
        formData.append('addSizes', form.addSizes.checked);
        if(addSizes){
            formData.append('sizes', JSON.stringify(selectedSizes));
            formData.append('colors', JSON.stringify(selectedColors));
        }
        formData.append('stock', form.stock.value);
        formData.append('gender', JSON.stringify(selectedGenders));
        formData.append('category', JSON.stringify(selectedCategories));
        formData.append('subcategory', JSON.stringify(selectedSubcategories));
        console.log(formData)
        if(accessToken){
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            })
            if(res.ok){
                setSuccessPrompt(true);
            }
        }
    }

    const uploadMedia = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            setMedia(event.target.files);
        }
    }

    return (
    <div className="m-auto flex flex-col w-2/3 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Product was published.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col gap-1">
                <Label htmlFor="p_name" className="uppercase font-bold">
                    Name
                </Label>
                <Input 
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                name="p_name" 
                type="text"/>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="price" className="uppercase font-bold">
                    Price
                </Label>
                <Input 
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                name="price"
                step="0.01"
                type="number"/> 
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="description" className="uppercase font-bold">
                    Description
                </Label>
                <Textarea 
                name="description"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-row">
                <Label htmlFor="addSizes" className="uppercase font-bold mr-4">
                    Add Sizes?
                </Label>
                <input 
                onChange={(e) => { setAddSizes(e.target.checked) }}
                type="checkbox" 
                name="addSizes"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                defaultChecked={false} 
                />
            </div>
            {addSizes &&
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="sizes" className="uppercase font-bold">
                        Sizes 
                    </Label>
                    <Autocomplete
                    onChange={(event, value) => setSelectedSizes(value)} 
                    id="sizes"
                    freeSolo
                    multiple
                    options={sizes && sizes.length > 0 ? sizes.map(size => size.size.toUpperCase()) : []}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="colors" className="uppercase font-bold">
                        Colors
                    </Label>
                    <Autocomplete
                    onChange={(event, value) => setSelectedColors(value)} 
                    id="colors"
                    freeSolo
                    multiple
                    options={colors && colors.length > 0 ? colors.map(color => color.name.toUpperCase()) : []}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </div>
            </div>}
            <div className="flex flex-col gap-1">
                <Label htmlFor="stock" className="uppercase font-bold">
                    Total Stock
                </Label>
                <Input
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                name="stock"
                type="number" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="gender" className="uppercase font-bold">
                    Genders
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedGenders(value)} 
                id="gender"
                freeSolo
                multiple
                options={genders && genders.length > 0 ? genders.map(gender => gender.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />}
                />
            </div>            
            <div className="flex flex-col gap-1">
                <Label htmlFor="category" className="uppercase font-bold">
                    Categories
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedCategories(value)} 
                id="category"
                freeSolo
                multiple
                options={categories && categories.length > 0 ? categories.map(category => category.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />}
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="subcategory" className="uppercase font-bold">
                    Subcategory
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedSubcategories(value)} 
                id="subcategory"
                freeSolo
                multiple
                options={subcategories && subcategories.length > 0 ? subcategories.map(sub => sub.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />}
                />
            </div>   
            <div className="flex flex-col gap-1">
                <Label htmlFor="image"  className="uppercase font-bold">
                    Image
                </Label>
                <Input 
                id="image"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                type="file" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => uploadMedia(e)} />
            </div>
            <Button 
            variant='outline'
            type="submit">
                Submit
            </Button>
        </form>
        }
    </div>
    )
}
