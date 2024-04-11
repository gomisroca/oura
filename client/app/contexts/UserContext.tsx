'use client'

import { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { Cookies, useCookies } from 'react-cookie';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    role: 'BASIC' | 'EDITOR' | 'SUPER' | 'ADMIN';
}

interface UserContext {
    user: UserData | undefined;
    userRegister: (credentials: RegisterFormData) => Promise<unknown | boolean>;
    userLogin:  (credentials: LoginFormData) => Promise<unknown | boolean>;
    userLogout: () => unknown | void; 
    getUserInfo: () => Promise<unknown | void>; 
    updateToken: (token: string) => unknown | void;
}

const UserContext = createContext<UserContext>({} as UserContext);
export default UserContext;

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: PropsWithChildren<{}>) {
    const [user, setUser] = useState<UserData | undefined>();
    const cookieManager = new Cookies();
    const [accessToken, setAccessToken] = useState<string | undefined>(cookieManager.get('oura__access_token__'))
    const [cookies, setCookie, removeCookie] = useCookies();

    const getUserInfo = async(): Promise<unknown | void> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if(res.ok){
                let userData: UserData = await res.json();
                setUser(userData);
            }
        }
        catch(err) {
            return err
        }

    }

    const userRegister = async(credentials: RegisterFormData): Promise<unknown | boolean> => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })
            
            if (res.status === 201) {
                const newToken = await res.json();
                removeCookie('oura__access_token__', { path: '/' });
                setCookie('oura__access_token__', newToken, { path: '/' });
                setAccessToken(newToken);

                return true;
            }
            return false;
        }catch(err){
            return err
        }
    }

    const userLogin = async(credentials: LoginFormData): Promise<unknown | boolean> => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })

            if(res.ok){
                const expiry = new Date();
                if (credentials.keepAlive){
                    expiry.setDate(expiry.getDate() + 7);
                } else{
                    expiry.setHours(expiry.getHours() + 1);
                }
                
                const newToken = await res.json();
                removeCookie('oura__access_token__', { path: '/' });
                setCookie('oura__access_token__', newToken, { path: '/', expires: expiry });
                setAccessToken(newToken);

                return true;
            }
            return false;
        }catch(err){
            return err
        }
    }

    const updateToken = (token: string): unknown | void => {
        try{
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 1);

            removeCookie('oura__access_token__', { path: '/' });
            setCookie('oura__access_token__', token, { path: '/', expires: expiry });
            setAccessToken(token);
        }catch(err){
            return err
        }
    }
    const userLogout = (): unknown | void  => {
        if (accessToken){
            try {
                removeCookie('oura__access_token__', { path: '/' });
                setAccessToken(undefined);
                setUser(undefined);
            }
            catch(err) {
                return err
            }
        }
    }

    useEffect((): void => {
        if(accessToken){
            getUserInfo();
        }
      }, [accessToken]);

    return (
        <UserContext.Provider value={({ user, userRegister, userLogin, userLogout, getUserInfo, updateToken })}>
            {children}
        </UserContext.Provider>
    )
}