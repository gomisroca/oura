import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

export default function Admin() {
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[]>();
    const [classes, setClasses] = useState<string[]>();
    const [types, setTypes] = useState<string[]>();
    const [sale, setSale] = useState<boolean>(false);


    const fetchCatalog = () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/catalog`)
        .then((res) => {
            let genreArray: string[] = [];
            let classArray: string[] = [];
            let typeArray: string[] = [];

            for(const product of res.data){
                if (!genreArray.includes(product.genre.toLowerCase())){
                    genreArray.push(product.genre.toLowerCase())
                }
                if (!classArray.includes(product.class.toLowerCase())){
                    classArray.push(product.class.toLowerCase())
                }
                if (!typeArray.includes(product.type.toLowerCase())){
                    typeArray.push(product.type.toLowerCase())
                }
            }
            setGenres(genreArray);
            setClasses(classArray);
            setTypes(typeArray);
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
        formData.append('product_name', form.product_name.value);
        formData.append('price', form.price.value);
        if(form.sale){
            formData.append('sale', form.sale.value);
        }
        formData.append('description', form.description.value);
        formData.append('genre', form.genre.value);
        formData.append('class', form.class.value);
        formData.append('type', form.type.value);
        formData.append('seasonal', form.seasonal.checked)
        console.log(formData)

        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/` , formData).then(res => {
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
                name="product_name" 
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
            <div>
                <label className="uppercase font-bold mr-4">
                    On Sale?
                </label> 
                <input type="checkbox" onChange={() => setSale(!sale)}></input>
            </div>
            {sale ?
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Sale Price
                </label>
                <input 
                name="sale"
                step="0.01"
                type="number"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            : null}
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Description
                </label>
                <textarea 
                name="description"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Gender
                </label>
                {genres ?
                <Autocomplete
                id="genre"
                freeSolo
                options={genres.map(genre => genre.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>            
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Class
                </label>
                {classes ?
                <Autocomplete
                id="class"
                freeSolo
                options={classes.map(x => x.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Type
                </label>
                {types ?
                <Autocomplete
                id="type"
                freeSolo
                options={types.map(type => type.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />
                : null }
            </div>   
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Seasonal?
                </label>
                <input 
                type="checkbox" 
                name="seasonal"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                defaultChecked={false} 
                />
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
