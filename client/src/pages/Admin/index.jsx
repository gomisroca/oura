import axios from "axios";
import { useEffect, useState } from "react";

export default function Admin() {
    const [media, setMedia] = useState();
    const [successPrompt, setSuccessPrompt] = useState(false);
    const [genres, setGenres] = useState();
    const [classes, setClasses] = useState();
    const [types, setTypes] = useState();


    const fetchCatalog = () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/catalog`)
        .then((res) => {
            let genreArray = [];
            let classArray = [];
            let typeArray = [];

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        console.log(form)
        const formData = new FormData();

        for (const i of Object.keys(media)) {
            formData.append('media', media[i]);
        };
        formData.append('title', form.title.value);
        formData.append('price', form.price.value);
        formData.append('sale', form.sale.value);
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

    const uploadMedia = (event) => {
        setMedia(event.target.files);
    }

    return (
    <>
        <form method="post" onSubmit={handleSubmit} className="flex-col grid gap-y-4 px-4 mt-10 text-zinc-700 bg-zinc-200">
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Name
                </label>
                <input 
                name="title" 
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
                    Sale
                </label>
                <input 
                name="sale"
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
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Gender
                </label>
                <select 
                name="genre"
                className="block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500">
                    {genres ?
                        genres.map(genre => (
                            <option value={genre}>{genre.toUpperCase()}</option>
                        ))
                    : null}
                </select>
            </div>            
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Class
                </label>
                <select 
                name="class"
                className="block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500">
                    {classes ?
                        classes.map(pclass => (
                            <option value={pclass}>{pclass.toUpperCase()}</option>
                        ))
                    : null}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Type
                </label>
                <select 
                name="type"
                className="block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500">
                    {types ?
                        types.map(type => (
                            <option value={type}>{type.toUpperCase()}</option>
                        ))
                    : null}
                </select>
            </div>   
            <div className="flex flex-row">
                <label className="uppercase font-bold mb-2">
                    Seasonal?
                </label>
                <input 
                type="checkbox" 
                name="seasonal"
                className="transition duration-200 m-auto p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                defaultChecked={false} 
                />
            </div>
           
            <div className="flex flex-col ">
                <label className="uppercase font-bold mb-2">
                    Image
                </label>
                <input 
                type="file" 
                onChange={uploadMedia}
                className="block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" />
            </div>
            <hr className="border border-neutral-800"/>
            <button 
            type="submit" 
            className="uppercase font-bold py-4 hover:bg-zinc-300 transition duration-200 w-full m-auto">
                Submit
            </button>
        </form>
        {successPrompt ?
            <div className='font-semibold text-center mt-2 mb-4'>Your post was published.</div>
        : null }
    </>
    )
}
