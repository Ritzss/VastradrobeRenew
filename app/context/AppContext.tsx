import { createContext } from "react";

export interface AppContextType{
    login: boolean;
    setLogin: (value: boolean)=> void;
}

export const AppContext = createContext<AppContextType|undefined>(undefined);