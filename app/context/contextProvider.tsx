"use client";

import { ReactNode, useState } from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({children}:{children: ReactNode})=>{
    const [login,setLogin] = useState<boolean>(false);

    return (
        <AppContext.Provider value={{login,setLogin}}>
            {children}
        </AppContext.Provider>
    )
}