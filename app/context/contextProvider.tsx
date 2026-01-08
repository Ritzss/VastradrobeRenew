"use client";

import { ReactNode, useState } from "react";
import { AppContext, LoginData, RegisterData } from "./AppContext";

export const AppProvider = ({children}:{children: ReactNode})=>{



    const [islogged,setIsLogged] = useState<boolean>(false);
    const [loginForm,setLoginForm] = useState<LoginData>({
        username:"",
        password:"",
    });
    const [registerForm,setRegisterForm] = useState<RegisterData>({
        username:"",
        email:"",
        password:"",
    });

    return (
        <AppContext.Provider value={{islogged,setIsLogged,loginForm,setLoginForm,registerForm,setRegisterForm}}>
            {children}
        </AppContext.Provider>
    )
}