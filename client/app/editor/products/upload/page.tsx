import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

export default function ProductUpload() {
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [genders, setGenders] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [subcategories, setSubcategories] = useState<string[]>();
    const [addSizes, setAddSizes] = useState<boolean>(false);

    const fetchCatalog = () => {
        axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        .then((res) => {
            let genderArray: string[] = [];
            let categoryArray: string[] = [];
            let subcategoryArray: string[] = [];

            for(const product of res.data){
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
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }
    useEffect(() => {
        fetchCatalog();
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            Array.from(media).forEach(file => formData.append('media', file))
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
        console.log(formData)

        await axios.post<void>(`${process.env.NEXT_PUBLIC_API_URL}/products/` , formData).then(res => {
            if(res.status === 201){
                setSuccessPrompt(true);
            }
        });
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
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Name
                </label>
                <input 
                name="p_name" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Price
                </label>
                <input 
                name="price"
                step="0.01"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
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
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Sizes 
                    </label>
                    <input
                    name="sizes"
                    type="text"
                    id="sizes"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Colors
                    </label>
                    <input
                    name="colors"
                    type="text"
                    id="colors"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
            </div>}
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Total Stock
                </label>
                <input 
                name="stock"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
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
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
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
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
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
            <div className="flex flex-col ">
                <label className="uppercase font-bold mb-2">
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
