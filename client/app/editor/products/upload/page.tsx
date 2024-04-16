'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { Cookies } from 'react-cookie';
import { getProducts } from "@/utils/products";

export default function ProductUpload() {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [genders, setGenders] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [subcategories, setSubcategories] = useState<string[]>();
    const [addSizes, setAddSizes] = useState<boolean>(false);

    const fetchCatalog = async() => {
        try{
            const data = await getProducts();
            if(data){
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
                }
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
            formData.append('sizes', form.sizes.value);
            formData.append('colors', form.colors.value);
        }
        formData.append('stock', form.stock.value);
        formData.append('gender', form.gender.value);
        formData.append('category', form.category.value);
        formData.append('subcategory', form.subcategory.value);

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
    <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Product was published.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Name
                </label>
                <input 
                name="p_name" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Price
                </label>
                <input 
                name="price"
                step="0.01"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Description
                </label>
                <textarea 
                name="description"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Add Sizes?
                </label>
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
                    <label className="uppercase font-bold">
                        Sizes 
                    </label>
                    <input
                    name="sizes"
                    type="text"
                    id="sizes"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col gap-1">
                    <label className="uppercase font-bold">
                        Colors
                    </label>
                    <input
                    name="colors"
                    type="text"
                    id="colors"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
            </div>}
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Total Stock
                </label>
                <input 
                name="stock"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Gender
                </label>
                {genders ?
                <Autocomplete
                id="gender"
                freeSolo
                options={genders.map(gender => gender.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>            
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Category
                </label>
                {categories ?
                <Autocomplete
                id="category"
                freeSolo
                options={categories.map(category => category.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>
            <div className="flex flex-col gap-1">
                <label className="uppercase font-bold">
                    Subcategory
                </label>
                {subcategories ?
                <Autocomplete
                id="subcategory"
                freeSolo
                options={subcategories.map(subcategory => subcategory.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>   
            <div className="flex flex-col gap-1 ">
                <label className="uppercase font-bold">
                    Image
                </label>
                <input 
                type="file" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => uploadMedia(e)}
                className="block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" />
            </div>
            <button 
            type="submit" 
            className="uppercase font-bold py-4 hover:bg-zinc-300 transition duration-200 w-full m-auto">
                Submit
            </button>
        </form>
        }
    </div>
    )
}
