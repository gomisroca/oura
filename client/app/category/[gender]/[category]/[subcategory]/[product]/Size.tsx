interface Props {
    item: Product;
    size: string;
    activeSize: string | null;
    onSizeSelection: (size: string) => void;
}

function checkStock(item, size): boolean {
    let colors: Color[] | undefined = item.sizes.find(s => s.size === size)?.colors;
    if(colors){
        for (const color of colors){
            if (color.amount > 0) {
                return true
            }
        }
    }
    return false
}

export default function Size({ item, size, activeSize, onSizeSelection }: Props) {
    let hasStock = checkStock(item, size);

    return(
        item && size ?
        <div className='flex justify-center'>
            {hasStock ?
            <span 
            onClick={() => onSizeSelection(size)} 
            className={
            activeSize == size ? 
            'w-[40px] text-center rounded border-zinc-400 bg-zinc-300 hover:bg-zinc-300 border-2 p-1 m-1 cursor-pointer'
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