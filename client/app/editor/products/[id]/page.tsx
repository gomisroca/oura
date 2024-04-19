'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProduct } from "@/utils/products";
import { Autocomplete, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
interface Params {
    id: string;
 }
interface ColorWithSizeName extends Color  {
    size: string;
}

export default function ProductUpdate({ params } : { params: Params }) {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const id = params.id;
    const [product, setProduct] = useState<Product>();
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);

    const [name, setName] = useState<string | undefined>();
    const [price, setPrice] = useState<string | undefined>('0');
    const [sales, setSales] = useState<string | undefined>('0');
    const [description, setDescription] = useState<string | undefined>();
    const [addSizes, setAddSizes] = useState<boolean>(false);
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [colorData, setColorData] = useState<ColorWithSizeName[] | undefined>();
    const [stock, setStock] = useState<string | undefined>('0');
    const [gender, setGender] = useState<string[]>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subcategory, setSubcategory] = useState<string[]>([]);
    const [onSeasonal, setOnSeasonal] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);

    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

    async function assignProduct(id: string){
        try{
            const data = await getProduct(id);
            if(data){
                setProduct(data);
                setName(data.name);
                setPrice(data.price.toString());
                setSales(data.sales.toString());
                setDescription(data.description);
                if(data.sizes.length > 0){
                    setAddSizes(true);
                    let totalAmount = 0;
                    let sizeArray: string[] = [];
                    let colorNameArray: string[] = [];
                    let colorArray: ColorWithSizeName[] = [];
                    data.sizes.forEach(size => {
                        if (!sizeArray.includes(size.size.toUpperCase())) {
                            sizeArray.push(size.size.toUpperCase());
                        }
                        size.colors.forEach(color => {
                            let colorData = {
                                ...color,
                                size: size.size
                            }
                            colorArray.push(colorData)
                            console.log(colorData)
                            if (!colorNameArray.includes(color.name.toLowerCase())) {
                                colorNameArray.push(color.name.toLowerCase());
                            }
                            totalAmount += color.amount;
                        });
                    });
                    setSizes(sizeArray)
                    setSelectedSizes(sizeArray)
                    setColorData(colorArray)
                    setSelectedColors(colorNameArray)
                    setColors(colorNameArray);
                    setStock(totalAmount.toString());
                }
                console.log(data.gender)
                setGender(data.gender);
                setSelectedGenders(data.gender);
                setCategory(data.category);
                setSelectedCategories(data.category);
                setSubcategory(data.subcategory);
                setSelectedSubcategories(data.subcategory);
                setOnSeasonal(data.onSeasonal);
                setOnSale(data.onSale);
            }
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if(!product){
            assignProduct(id)
        }
    }, [])
    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
        }
        formData.append('name', name!);
        formData.append('price', price!);
        formData.append('sales', sales!);
        formData.append('description', description!);
        formData.append('addSizes', addSizes.toString()!);
        if(addSizes){
            formData.append('sizes', JSON.stringify(selectedSizes)!);
            formData.append('colors', JSON.stringify(selectedColors)!);
        }
        formData.append('stock', stock!);
        formData.append('gender', JSON.stringify(selectedGenders)!);
        formData.append('category', JSON.stringify(selectedCategories)!);
        formData.append('subcategory', JSON.stringify(selectedSubcategories)!);
        formData.append('onSeasonal', onSeasonal.toString()!);
        formData.append('onSale', onSale.toString()!);

        if(accessToken){
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product?.id}`, {
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
    <div className="m-auto w-full lg:w-2/3 flex flex-col mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Product {product?.name} was updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Name
                </Label>
                <Input
                value={name || ''}
                onChange={(e) => { setName(e.target.value) }}
                name="p_name" 
                type="text" 
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Price
                </Label>
                <Input 
                value={price || 0}
                onChange={(e) => { setPrice(e.target.value) }}
                name="price"
                step="0.01"
                type="number"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Sales
                </Label>
                <Input 
                value={sales || 0}
                onChange={(e) => { setSales(e.target.value) }}
                name="sales"
                type="number"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Description
                </Label>
                <Textarea 
                value={description || ''}
                onChange={(e) => { setDescription(e.target.value) }}
                name="description"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-row">
                <Label className="uppercase font-bold">
                    Add Sizes?
                </Label>
                <input 
                checked={addSizes || false}
                onChange={(e) => { setAddSizes(e.target.checked) }}
                type="checkbox" 
                name="addSizes"
                className="ml-4 transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                />
            </div>
            {addSizes &&
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <Label className="uppercase font-bold">
                        Sizes
                    </Label>
                    <Autocomplete
                    onChange={(event, value) => setSelectedSizes(value)} 
                    value={selectedSizes || sizes || ''}
                    id="sizes"
                    freeSolo
                    multiple
                    options={sizes && sizes.length > 0 ? sizes.map(size => size.toUpperCase()) : []}
                    renderInput={(params) => <TextField {...params} />} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="uppercase font-bold">
                        Colors
                    </Label>
                    <Autocomplete
                    onChange={(event, value) => setSelectedColors(value)} 
                    id="colors"
                    value={selectedColors || colors || ''}
                    freeSolo
                    multiple
                    options={colors && colors.length > 0 ? colors.map(color => color.toUpperCase()) : []}
                    renderInput={(params) => <TextField {...params} />} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="uppercase text-sm">
                        Current Stock
                    </Label>
                    <div  className="gap-2 grid grid-cols-4">
                    {colorData && colorData.map(x => (
                    <div key={x.id} className="flex flex-row rounded-full px-2 bg-zinc-300 items-center text-black">
                        <span className="px-2">{x.size}</span>
                        <span className={`border-l px-2 border-zinc-400 bg-${x.name}-400 py-1`}>{x.name.toUpperCase()}</span>
                        <span className="border-l px-2 border-zinc-400">{x.amount}</span>
                    </div>
                    ))}
                    </div>
                </div>
            </div>}
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Total Stock
                </Label>
                <input 
                value={stock || 0}
                name="stock"
                onChange={(e) => { setStock(e.target.value) }}
                type="number"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600" /> 
            </div>
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Gender
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedGenders(value)} 
                value={selectedGenders || gender || ''}
                id="gender"
                freeSolo
                multiple
                options={gender && gender.length > 0 ? gender.map(gender => gender.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />} 
                />
            </div>            
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Category
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedCategories(value)} 
                value={selectedCategories || category || ''}
                id="category"
                freeSolo
                multiple
                options={category && category.length > 0 ? category.map(category => category.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />} 
                />
            </div>
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Subcategory
                </Label>
                <Autocomplete
                onChange={(event, value) => setSelectedSubcategories(value)} 
                value={selectedSubcategories || subcategory || ''}
                id="subcategory"
                freeSolo
                multiple
                options={subcategory && subcategory.length > 0 ? subcategory.map(sub => sub.toUpperCase()) : []}
                renderInput={(params) => <TextField {...params} />} 
                />
            </div>   
            <div className="flex flex-row">
                <Label className="uppercase font-bold">
                    Seasonal?
                </Label>
                <input 
                checked={onSeasonal || false}
                onChange={(e) => { setOnSeasonal(e.target.checked) }}
                type="checkbox" 
                name="onSeasonal"
                className="ml-4 transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500" 
                />
            </div>
            <div className="flex flex-row">
                <Label className="uppercase font-bold">
                    Sale?
                </Label>
                <input 
                checked={onSale || false}
                onChange={(e) => { setOnSale(e.target.checked) }}
                type="checkbox" 
                name="onSale"
                className="ml-4 transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="uppercase font-bold">
                    Image
                </Label>
                {product?.image &&
                <div className="p-2 border border-zinc-400">
                    <span className="text-sm uppercase">Current Image</span>
                    <img src={product.image} />
                </div>}
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