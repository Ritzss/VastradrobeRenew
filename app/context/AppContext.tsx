'use client'
import { createContext, Dispatch, SetStateAction } from "react";

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email:string;
  password:string;
}

export interface AppContextType {
  islogged: boolean;
  setIsLogged:Dispatch<SetStateAction<boolean>>;
  loginForm: LoginData;
  setLoginForm: Dispatch<SetStateAction<LoginData>>;
  registerForm: RegisterData;
  setRegisterForm: Dispatch<SetStateAction<RegisterData>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
