import axios from "axios";
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
            await axios.get<UserData>(`${import.meta.env.VITE_REACT_APP_API_URL}/user/info`)
            .then(res => {
                let userData: UserData = {
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    role: res.data.role
                }
                setUser(userData);
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                }
            })
        }
        catch(err) {
            return err
        }
    }

    const userRegister = async(credentials: RegisterFormData): Promise<unknown | boolean> => {
        try{
            let registered: boolean = await axios.post<string>(`${import.meta.env.VITE_REACT_APP_API_URL}/user/register/`, credentials)
            .then(res => {
                if (res.status === 201) {
                    removeCookie('oura__access_token__', { path: '/' });
                    setCookie('oura__access_token__', res.data, { path: '/' });
                    setAccessToken(res.data);
                    return true;
                } else{
                    return false;
                }

            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
                return false
            })
            return registered;
        }catch(err){
            return err
        }
    }

    const userLogin = async(credentials: LoginFormData): Promise<unknown | boolean> => {
        try{
            let loggedIn: boolean = await axios.post<string>(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login/`, credentials)
            .then(res => {
                const expiry = new Date();
                if (credentials.keepAlive){
                    expiry.setDate(expiry.getDate() + 7);
                } else{
                    expiry.setHours(expiry.getHours() + 1);
                }

                removeCookie('oura__access_token__', { path: '/' });
                setCookie('oura__access_token__', res.data, { path: '/', expires: expiry });
                setAccessToken(res.data);
                return true;
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
                return false;
            })
            return loggedIn;
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
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            getUserInfo();
        }
      }, [accessToken]);

    return (
        <UserContext.Provider value={({ user, userRegister, userLogin, userLogout, getUserInfo, updateToken })}>
            {children}
        </UserContext.Provider>
    )
}