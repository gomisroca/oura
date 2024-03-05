import axios from "axios";
import { createContext, useState, useEffect, useContext } from 'react';
import { Cookies, useCookies } from 'react-cookie';

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const cookieManager = new Cookies();
    const [accessToken, setAccessToken] = useState(cookieManager.get('oura__access_token__'))
    const [cookies, setCookie, removeCookie] = useCookies(['oura__token__']);

    const getUserInfo = async() => {
        try {
            await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/user/info`)
            .then(res => {
                let userData = {
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    email: res.data.email
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
            console.log(err.message)
        }
    }

    const userRegister = async(credentials) => {
        try{
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/register/`, credentials)
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
            })
        }catch(err){
            return err
        }
    }

    const userLogin = async(credentials) => {
        try{
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login/`, credentials)
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
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        }catch(err){
            return err
        }
    }

    const userLogout = async() => {
        if (accessToken){
            try {
                removeCookie('oura__access_token__', { path: '/' });
                setAccessToken(null);
                setUser(null);
            }
            catch(err) {
                console.log(err.message)
            }
        }
    }

    useEffect(() => {
        if(accessToken){
            axios.defaults.headers.common['Authorization'] = `${accessToken}`;
            getUserInfo();
        }
      }, [accessToken]);

    return (
        <UserContext.Provider value={({ user, userRegister, userLogin, userLogout, getUserInfo })}>
            {children}
        </UserContext.Provider>
    )
}