import { Link, useParams, useOutletContext } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Sizes from "./Sizes";
import AddToCart from "./AddToCart";

function Product() {
  const genre = useParams().genre;
  const category = useParams().category;
  const type = useParams().type;
  const id = useParams().product;
  const isMobile = useOutletContext();
  
  const [product, setProduct] = React.useState([]);
  React.useEffect(() =>{
    if(id){
      axios.get(`http://localhost:4030/clothes/item/${id}`).then((res) => {
        setProduct(res.data);
      })
    }
  }, [id]);
  let item = product;
  
  const [catalog, setCatalog] = React.useState([]);
  React.useEffect(() => {
    axios.get('http://localhost:4030/clothes/catalog').then((res) => {
      setCatalog(res.data);
    })
  }, []);
  let itemData = catalog.filter(x => (x.genre == genre || x.genre == 'neutral') && x.class == category);
  let filter = itemData.find(x => x.id == item.id);
  const index = itemData.indexOf(filter);
  if (index > -1) {
    itemData.splice(index, 1);
  }
  itemData = itemData.slice(0,4);

  return (
    <div className='flex flex-col overflow-hidden text-gray-700'>
      {item ?
      <div className="p-10 cursor-default w-screen md:w-[650px] mt-10 self-center transition duration-200 from-gray-200 to-gray-400/30 hover:from-gray-300 hover:to-gray-400/30 hover:border-black/20 border-white border-2">
        <img
          className='mx-auto'
          src={`${item.image}`}
          srcSet={`${item.image}`}
          alt={item.title}
          loading="lazy"
        />
        <div className="border-t-2 border-black/10 ">
          {item.sizes ? <Sizes item={item} flex={'row'} /> : <AddToCart item={item} /> }
        </div>
        <div>
          <div className="justify-between p-2 flex text-lg font-bold border-t-2 border-black/10 ">
            <div>{item.title}</div>
            <div>{item.sale ? <span>{item.sale}€ <span className="line-through decoration-2 decoration-red-600/70">{item.price}€</span></span> : item.price + '€' }</div>
          </div>
          <div className="p-2 overflow-clip text-justify">
            {item.description}
            <div className="flex justify-end">
              <Tooltip 
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Add an Alarm">
                <IconButton className='hover:stroke-black/20' aria-label="Add an Alarm">
                  <AlarmIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      : <Skeleton variant="rectangular" />}
      {itemData.length > 0 ?
      <div className='mx-auto mt-3 px-2'>
        <div className='mt-10 text-lg text-center font-semibold'>RELATED ITEMS
          <ImageList cols={isMobile ? 2 : 4} gap={2}>
            {itemData.map((product) => (
              <Tooltip 
              key={product.id}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={product.title}>
                <Link 
                onClick={(e => {
                  e.preventDefault(); 
                  setProduct(product); 
                  window.history.replaceState(null, product.title, '/' + product.genre + '/' + product.class + '/' + product.type + '/' + item.id)
                })}
                >
                  <div className='h-fit flex relative flex-col cursor-pointer'>
                    <ImageListItem  
                    className='transition duration-200 bg-gradient-to-br from-gray-200 to-gray-400/30 hover:from-gray-300 hover:to-gray-400/30 hover:border-black/20 border-white border-2 w-[150px] md:w-[200px]' 
                    key={product.id}>
                        <img
                          className='max-h-[200px] md:max-h-[250px]'
                          src={`${product.image}`}
                          srcSet={`${product.image}`}
                          alt={product.title}
                          loading="lazy"
                        />
                      <ImageListItemBar
                        className='mx-2'
                        position="below"
                        title={product.title}
                        subtitle={product.sale ? <span>{product.sale}€ <span className="line-through decoration-2 decoration-red-600/70">{product.price}€</span></span> : product.price + '€' }
                      />
                    </ImageListItem>
                  </div>
                </Link>
              </Tooltip>
            ))}
          </ImageList>
        </div>
      </div>
      : undefined }
    </div>
  )
}

export default Product
