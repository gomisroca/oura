import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('oura__access_token__')

    const getUserInfo = async(): Promise<User | null> => {
        try {
            if(accessToken){
                try{
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/info`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken.value}`
                        }
                    });
                    if(res.ok){
                        return res.json();
                    }
                } catch(err){
                    console.log(err)
                }
            }
            return null
        }
        catch(err) {
            return err
        }
    }

    const user: User | null = await getUserInfo();

    if (((user && user.role == 'BASIC') || user == null) && request.nextUrl.pathname.startsWith('/editor')) {
        return Response.redirect(new URL('/', request.url))
    }
    
    // if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    //     return Response.redirect(new URL('/login', request.url))
    // }
}
 
export const config = {
  matcher: ['/((?!_next/static|api|_next/image|.*\\.png$).*)'],
}