export default function Size({ item, size, activeSize, sizeSelection }) {
    return(
        item && size ?
        <div className='flex justify-center'>
            {item.sizes[size] && item.sizes[size] != 0 ?
            <span 
            onClick={() => sizeSelection(size)} 
            className={
            activeSize == size ? 
            'w-[40px] text-center rounded border-zinc-400 bg-zinc-200 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
            :
            'w-[40px] text-center rounded border-2 p-1 m-1 cursor-pointer border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300'}>
                {size}
            </span>
            : 
            <span className='w-[40px] text-center border-zinc-400 rounded border-2 p-1 m-1 opacity-30'>
                {size}
            </span> 
            }
        </div>
        : null
    )
}