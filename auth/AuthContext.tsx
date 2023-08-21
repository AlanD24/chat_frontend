import { fetchWithToken, fetchWithoutToken } from "@/helpers/fetch";
import React, { SetStateAction, createContext, useCallback, useState } from "react";

interface InitialState {
    _id: any,
    checking: boolean,
    logged: boolean,
    name: string,
    email: string,
    description: string,
    image: string
}

const initialState = {
    _id: null,
    checking: true,
    logged: false,
    name: "",
    email: "",
    description: "",
    image: ""
}

interface AuthContextType {
    verifyToken: () => Promise<boolean>;
    login: (email: string, password: string) => Promise<any>;
    getUserInfo: (userId: string) => Promise<any>;
    createAccount: (email: string, name: string, password1: string, password2: string) => Promise<any>;
    updateUserInfo: (userId: string, formData: FormData) => Promise<any>;
    updateImageAuth: (image: string) => any;
    auth: InitialState;
}

const defaultAuthContext: AuthContextType = {
    verifyToken: () => { return new Promise((res, rej) => { res(true); }) },
    login: (email: string, password: string) => {return new Promise((resolve, reject) => { })},
    getUserInfo: (userId: string) => { return new Promise((res, rej) => {})},
    createAccount: (email: string, name: string, password1: string, password2: string) => {return new Promise((res, rej) => {})},
    updateUserInfo: (userId: string, formData: FormData) => { return new Promise((res, rej) => {}) },
    updateImageAuth: (image: string) => {},
    auth: initialState
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface ChildProps {
    children: any;
}

export const AuthProvider: React.FC<ChildProps> = ({ children }) => {

  const [ auth, setAuth ] = useState( initialState );

  const verifyToken = useCallback((): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('token');

        if(!token) {
            setAuth({
                _id: null,
                checking: false,
                logged: false,
                name: "",
                email: "",
                description: "",
                image: ""
            });
            
            resolve(false);
        } else {
            const resp = await fetchWithToken( 'auth/renew-token' );

            if( resp.token && resp.user ) {
                localStorage.setItem('token', resp.token);
                const { user } = resp;
        
                setAuth({
                    _id: user._user,
                    checking: false,
                    logged: true,
                    name: user.name,
                    email: user.email,
                    description: user.description,
                    image: user.image
                });
                
                resolve(true);
            } else {
                setAuth({
                    _id: null,
                    checking: false,
                    logged: false,
                    name: "",
                    email: "",
                    description: "",
                    image: ""
                });
        
                resolve(false);
            }
        }
    });
  }, []);

  const login = (email: string, password: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        // Set data and set endpoint of petition
        const dataToSend = JSON.stringify({ email, password });

        const endpoint: string = "auth/login";
        const response = await fetchWithoutToken( endpoint, "POST", dataToSend );

        if(!response)
            reject({ error: "Could not login" });
        
        resolve(response);
    });
  }

  const getUserInfo = ( userId: string ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const endpoint: string = `auth/user/${userId}`;
        const response = await fetchWithToken( endpoint );

        if(!response)
            reject({ error: 'Could not retrieved user data' });
        
        // Return user info
        resolve(response);
    });
  }

  const createAccount = (email: string, name: string, password1: string, password2: string): Promise<any> => {
    try {
        return new Promise(async (resolve, reject) => {
            // Set data and set endpoint of petition
            const dataToSend = JSON.stringify({ name, email, password1, password2 });
        
            const endpoint: string = "auth/create-user";
            const response = await fetchWithoutToken( endpoint, "POST", dataToSend );
    
            if(!response)
                reject({ error: "Could not login" });
            
            resolve(response);
        });
    } catch (error) {
        return new Promise((res, rej) => {
            res(error);
        });
    }
  }

  const updateImageAuth = ( image: string ): any => {
    return setAuth({
        ...auth,
        image: image
    });
  }

  const updateUserInfo = ( userId: string, formData: FormData ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const name = formData.get('name');
        const description = formData.get('description');

        const endpoint: string = `auth/update/${ userId }`;
        const response = await fetchWithToken( endpoint, "PUT", formData );

        if(!response)
            reject({ error: "Could not update data" });

        // Edit fields of auth
        if(typeof name === "string" && typeof description === "string") {
            setAuth({
                ...auth,
                name,
                description
            });
        }

        resolve(response);
    });
  }
 
  return (
    <AuthContext.Provider value={{
        auth,
        verifyToken,
        login,
        createAccount,
        updateUserInfo,
        getUserInfo,
        updateImageAuth,
    }}>
        { children }
    </AuthContext.Provider>
  )
}