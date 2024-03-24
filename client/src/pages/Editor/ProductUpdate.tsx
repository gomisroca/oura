import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductUpdate() {
    const id = useParams().id;
    const [product, setProduct] = useState<Product>();
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);

    const [name, setName] = useState<string | undefined>();
    const [price, setPrice] = useState<string | undefined>();
    const [sales, setSales] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    const [addSizes, setAddSizes] = useState<boolean>(false);
    const [sizes, setSizes] = useState<any>([]);
    const [colors, setColors] = useState<any>([]);
    const [colorData, setColorData] = useState<ColorWithSizeName[] | undefined>();
    const [stock, setStock] = useState<string | undefined>();
    const [gender, setGender] = useState<string | undefined>();
    const [category, setCategory] = useState<string | undefined>();
    const [subcategory, setSubcategory] = useState<string | undefined>();
    const [onSeasonal, setOnSeasonal] = useState<boolean>(false);
    const [onSale, setOnSale] = useState<boolean>(false);

    interface ColorWithSizeName extends Color  {
        size: string;
    }
    useEffect(() => {
        axios.get<Product>(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${id}`)
        .then(res => {
            setProduct(res.data);
            setName(res.data.name);
            setPrice(res.data.price.toString());
            setSales(res.data.sales.toString());
            setDescription(res.data.description);
            if(res.data.sizes.length > 0){
                setAddSizes(true);
                let totalAmount = 0;
                let sizeArray: string[] = [];
                let colorNameArray: string[] = [];
                let colorArray: ColorWithSizeName[] = [];
                res.data.sizes.forEach(size => {
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
            setGender(res.data.gender);
            setCategory(res.data.category);
            setSubcategory(res.data.subcategory);
            setOnSeasonal(res.data.onSeasonal);
            setOnSale(res.data.onSale);
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
    }, [id])
    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            Array.from(media).forEach(file => formData.append('media', file))
        }
        formData.append('name', name!);
        formData.append('price', price!);
        formData.append('sales', sales!);
        formData.append('description', description!);
        formData.append('addSizes', addSizes.toString()!);
        if(addSizes){
            formData.append('sizes', sizes!);
            formData.append('colors', colors!);
            formData.append('stock', stock!);
        }
        formData.append('gender', gender!);
        formData.append('category', category!);
        formData.append('subcategory', subcategory!);
        formData.append('onSeasonal', onSeasonal.toString()!);
        formData.append('onSale', onSale.toString()!);
        console.log(formData)

        await axios.post<void>(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${product?.id}` , formData).then(res => {
            if(res.status === 200){
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
        <div className='font-semibold text-center mt-2 mb-4'>Product {product?.name} was updated.</div>
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
                value={name || ''}
                onChange={(e) => { setName(e.target.value) }}
                name="p_name" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Price
                </label>
                <input 
                value={price || 0}
                onChange={(e) => { setPrice(e.target.value) }}
                name="price"
                step="0.01"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Sales
                </label>
                <input 
                value={sales || 0}
                onChange={(e) => { setSales(e.target.value) }}
                name="sales"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Description
                </label>
                <textarea 
                value={description || ''}
                onChange={(e) => { setDescription(e.target.value) }}
                name="description"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Add Sizes?
                </label>
                <input 
                checked={addSizes || false}
                onChange={(e) => { setAddSizes(e.target.checked) }}
                type="checkbox" 
                name="addSizes"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                />
            </div>
            {addSizes &&
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Sizes
                    </label>
                    {sizes ?
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
                    />
                    : null }
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Colors
                    </label>
                    {colors ?
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
                    />
                    : null }
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 my-2">
                        <span className="uppercase text-sm">Current Stock</span>
                        <div  className="flex flex-row gap-2">
                        {colorData && colorData.map(x => (
                        <div key={x.id} className="flex flex-row rounded-full px-2 bg-zinc-300 items-center text-black">
                            <span className="px-2">{x.size}</span>
                            <span className={`border-l px-2 border-zinc-400 bg-${x.name}-400 py-1`}>{x.name.toUpperCase()}</span>
                            <span className="border-l px-2 border-zinc-400">{x.amount}</span>
                        </div>
                        ))}
                        </div>
                    </div>
                    <label className="uppercase font-bold mb-2">
                        Total Stock
                    </label>
                    <input 
                    value={stock || 0}
                    name="stock"
                    onChange={(e) => { setStock(e.target.value) }}
                    type="number"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
            </div>}
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Gender
                </label>
                <input
                value={gender || ''}
                onChange={(e) => { setGender(e.target.value) }}
                name="gender" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>            
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Category
                </label>
                <input
                value={category || ''}
                onChange={(e) => { setCategory(e.target.value) }}
                name="category" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Subcategory
                </label>
                <input
                value={subcategory || ''}
                onChange={(e) => { setSubcategory(e.target.value) }}
                name="subcategory" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>   
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Seasonal?
                </label>
                <input 
                checked={onSeasonal || false}
                onChange={(e) => { setOnSeasonal(e.target.checked) }}
                type="checkbox" 
                name="onSeasonal"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500" 
                />
            </div>
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Sale?
                </label>
                <input 
                checked={onSale || false}
                onChange={(e) => { setOnSale(e.target.checked) }}
                type="checkbox" 
                name="onSale"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="uppercase font-bold">
                    Image
                </label>
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