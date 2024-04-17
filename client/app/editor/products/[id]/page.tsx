'use client'

import { Label } from "@/components/ui/label";
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
    const [sizes, setSizes] = useState<any>([]);
    const [colors, setColors] = useState<any>([]);
    const [colorData, setColorData] = useState<ColorWithSizeName[] | undefined>();
    const [stock, setStock] = useState<string | undefined>('0');
    const [gender, setGender] = useState<string | undefined>();
    const [category, setCategory] = useState<string | undefined>();
    const [subcategory, setSubcategory] = useState<string | undefined>();
    const [onSeasonal, setOnSeasonal] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);

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
                    setColorData(colorArray)
                    setColors(colorNameArray);
                    setStock(totalAmount.toString());
                }
                setGender(data.gender);
                setCategory(data.category);
                setSubcategory(data.subcategory);
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
            formData.append('sizes', sizes!);
            formData.append('colors', colors!);
        }
        formData.append('stock', stock!);
        formData.append('gender', gender!);
        formData.append('category', category!);
        formData.append('subcategory', subcategory!);
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
    <div className="m-auto w-2/3 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
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
                <input
                value={name || ''}
                onChange={(e) => { setName(e.target.value) }}
                name="p_name" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Price
                </Label>
                <input 
                value={price || 0}
                onChange={(e) => { setPrice(e.target.value) }}
                name="price"
                step="0.01"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Sales
                </Label>
                <input 
                value={sales || 0}
                onChange={(e) => { setSales(e.target.value) }}
                name="sales"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col gap-1">
                <Label className="uppercase font-bold">
                    Description
                </Label>
                <textarea 
                value={description || ''}
                onChange={(e) => { setDescription(e.target.value) }}
                name="description"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
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
                    {sizes &&
                    <Autocomplete
                    multiple
                    value={sizes}
                    onChange={(event: React.ChangeEvent<{}>, newSizes: string[]) => {
                        setSizes(newSizes);
                    }}
                    id="size"
                    freeSolo
                    options={sizes}
                    renderInput={(params) => <TextField {...params} />}
                    />}
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="uppercase font-bold">
                        Colors
                    </Label>
                    {colors &&
                    <Autocomplete
                    multiple
                    value={colors}
                    onChange={(event: React.ChangeEvent<{}>, newColors: string[]) => {
                        setColors(newColors);
                    }}
                    id="colors"
                    freeSolo
                    options={colors}
                    renderInput={(params) => <TextField {...params} />}
                    />}
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
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Gender
                </Label>
                <input
                value={gender || ''}
                onChange={(e) => { setGender(e.target.value) }}
                name="gender" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>            
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Category
                </Label>
                <input
                value={category || ''}
                onChange={(e) => { setCategory(e.target.value) }}
                name="category" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Subcategory
                </Label>
                <input
                value={subcategory || ''}
                onChange={(e) => { setSubcategory(e.target.value) }}
                name="subcategory" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
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