'use client'
interface Props {
    item: Product;
    size: string;
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

export default function Size({ item, size, onSizeSelection }: Props) {
    let hasStock = checkStock(item, size);
    function handleSelection(size){
        onSizeSelection(size)
    }
    return(
        item && size ?
        <div className='w-full flex justify-center'>
            {hasStock ?
            <span 
            className="w-full text-zinc-700"
            onClick={(e) => {e.preventDefault(); handleSelection(size)}}>
                {size}
            </span>
            : 
            <span className='w-full text-center rounded p-1 m-1 opacity-30 '>
                {size}
            </span> 
            }
        </div>
        : null
    )
}