export async function getCategories() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}

export async function getCategory(gender: string){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${gender}`);
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}