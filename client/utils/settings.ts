export async function getHomepageSettings() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
        if(!res.ok){
            return null
        }
        return res.json();
    }catch(err){
        console.log(err)
    }
}

export async function getAboutSettings() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`)
        if(!res.ok){
            return null
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}  

export async function getSidebarSettings() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/sidebar`)
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}

export async function getNavigationSettings(){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/navigation`)
        if(!res.ok){
            return null
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}

export async function getCategorySettings(category?:string) {
    try{
        let res;
        if(category){
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories/${category.toLowerCase()}`)
        }else
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories`)
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}