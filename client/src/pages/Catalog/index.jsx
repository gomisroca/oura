import ManImg from '../../assets/categories/man.jpg';
import WomanImg from '../../assets/categories/woman.jpg';
import OutdoorsImg from '../../assets/categories/outdoors.jpg';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Filter from './Filter';
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import axios from 'axios';
import React from "react";
import Skeleton from '@mui/material/Skeleton';

function Catalog() {
    const navigate = useNavigate();
    let genre = useParams().genre;
    let category = useParams().category;
    let type = useParams().type;

    const isMobile = useOutletContext();

    const [catalog, setCatalog] = React.useState([]);
    React.useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/catalog`)
        .then((res) => {
        setCatalog(res.data);
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
    }, []);

    let products = catalog.filter(x => (x.genre.toLowerCase() == genre || x.genre == 'neutral'));
    if(category == 'season'){
        products = products.filter(x => x.seasonal == true);
    } else if (category != undefined) {
        products = products.filter(x => x.class == category);
    }
    if(type != undefined){
        products = products.filter(x => x.type == type);
    }

    let banner;
    switch(genre){
        case 'man':
        banner = ManImg;
        break;
        case 'woman':
        banner = WomanImg;
        break;
        default:
        banner = OutdoorsImg;
        break;
    }
    
    //Filter Handling
    const sizes = ['XS','S','M','L','XL','XXL'];
    const [sizeFilter, setSizeFilter] = React.useState(null);

    const colors = ['black','white','red','orange','yellow','blue','purple', 'green'];
    const [colorFilter, setColorFilter] = React.useState(null);

    const filteredClothes = products.filter(item => {
        if(sizeFilter == null || sizeFilter == 'All sizes'){
        return true;
        }
        if (sizeFilter && item.sizes) {
        for(let i = 0; item.sizes[sizeFilter].length; i++){
            if(item.sizes[sizeFilter][i]){
            if(item.sizes[sizeFilter][i].amount > 0){
                return true;
            }
            } else{
            return false;
            }
        }
        } else {
        return false;
        }
    });

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
        <div className='grid h-[100px] md:h-[400px] w-screen'>
            {banner ? 
            <img
            className= 'h-full w-screen brightness-75'
            src={banner}
            alt="Sale Image"
            />
            : <Skeleton variant="rectangular" />}
            {category ? 
            <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
            {genre}
            </div> 
            : 
            <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
            {genre}
            </div>}
            {category ? 
            <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
            {category}
            </div> 
            : undefined}
            {type ? 
            <div className='absolute uppercase text-[35px] md:text-[100px] text-zinc-200 self-center justify-self-center mt-[65px] md:mt-[230px]'>
            {type}
            </div> 
            : undefined }
        </div>
        
        <div>
            <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}>
            <option>All sizes</option>
            {sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
            ))}
            </select>
        </div>

        {products ?
            <div className='mx-auto p-5 mb-5 text-zinc-700'>
            <ImageList cols={isMobile ? 2 : 6} gap={2}>
                {filteredClothes.sort(({sales:a}, {sales:b}) => b-a).map((item) => (
                <div 
                key={item.id}
                className='h-fit flex relative flex-col' 
                onClick={() => navigate('/' + item.genre + '/' + item.class + '/' + item.type + '/' + item.id)}>
                    <ImageListItem  
                    className='transition duration-200 bg-zinc-200 hover:bg-zinc-300 border-zinc-400 hover:border-zinc-500 hover:text-zinc-800 border-2 w-[150px] md:w-[200px]' 
                    >
                    <img
                        className='max-h-[200px] md:max-h-[250px]'
                        src={`${item.image}`}
                        srcSet={`${item.image}`}
                        alt={item.title}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        className='mx-2'
                        position="below"
                        title={item.title}
                        subtitle={item.sale ? <span>{item.sale}€ <span className="line-through decoration-2 decoration-red-600/70">{item.price}€</span></span> : item.price + '€' }
                    />
                    </ImageListItem>
                </div>
                ))}
            </ImageList>
            </div>
        : 
            undefined 
        }
        </div>
    )
}

export default Catalog
