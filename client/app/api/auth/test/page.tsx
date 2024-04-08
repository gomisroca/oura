'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Test() {  
    const { data: session } = useSession();
    console.log(session)
    if (session) {    
        return (      
            <>        
                <div>Signed in as {session.user!.email} </div>
                <br />        
                <button onClick={() => signOut()}>Sign out</button>      
            </>    
        )  
    }  
    return (    
        <div className="mt-10 flex">      
            <div>Not signed in</div>
            <br />      
            <button onClick={() => signIn()}>Sign in</button>    
        </div>  
    )
  }
  