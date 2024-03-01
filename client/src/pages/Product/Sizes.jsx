import * as React from 'react';
import Colors from './Colors';

export default function Sizes(props) {
    const [itemChanged, setChange] = React.useState(false)
    const [activeSize, setSize] = React.useState(null);
    let item = props.item;

    const sizeSelection = (item, size) => {
        item.chosenSize = size;
        setSize(size)
        setChange(!itemChanged);
    }
    
    return(
        <div className='justify-center flex flex-col text-zinc-700'>
            <div className={'justify-center flex flex-row'}>
                <div className='flex justify-center'>
                    {item.sizes.XS && item.sizes.XS != 0 ?
                    <span 
                    onClick={() => sizeSelection(item, 'XS')} 
                    className={
                    activeSize == 'XS' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        XS
                    </span>
                    : 
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        XS
                    </span> 
                    }
                    {item.sizes.S && item.sizes.S != 0 ?
                    <span 
                    onClick={() => sizeSelection(item, 'S')} 
                    className={
                    activeSize == 'S' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        S
                    </span>
                    : 
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        S
                    </span> 
                    }
                    {item.sizes.M && item.sizes.M != 0 ?
                    <span 
                    onClick={() => sizeSelection(item, 'M')}
                    className={
                    activeSize == 'M' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        M
                    </span>
                    : 
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        M
                    </span> 
                    }
                </div>
                <div className='flex justify-center'>
                    {item.sizes.L && item.sizes.L != 0 ?
                    <span 
                    onClick={() => sizeSelection(item, 'L')} 
                    className={
                    activeSize == 'L' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        L
                    </span>
                    : 
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        L
                    </span> 
                    }
                    {item.sizes.XL && item.sizes.XL != 0 ?
                    <span 
                    onClick={() => sizeSelection(item, 'XL')}
                    className={
                    activeSize == 'XL' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        XL 
                    </span>
                    :
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        XL
                    </span>  
                    }
                    {item.sizes.XXL && item.sizes.XXL != 0 ? 
                    <span 
                    onClick={() => sizeSelection(item, 'XXL')} 
                    className={
                    activeSize == 'XXL' ? 
                    'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
                    :
                    'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                        2XL
                    </span>
                    : 
                    <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                        2XL
                    </span> 
                    }
                </div>
            </div>
            <div className='flex'>
                <Colors item={item} />
            </div>
        </div>
        
    )
}