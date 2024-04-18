export async function getProducts() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        if(!res.ok){
            return null
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}

export async function getProduct(id: string) {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)    
        if(!res.ok){
            return null
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}
