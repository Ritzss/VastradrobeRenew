'use client'
import { createContext, Dispatch, FormEvent, SetStateAction } from "react";

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
  handleRegister:(e:FormEvent<HTMLFormElement>)=>void;
  handleLogin:(e:FormEvent<HTMLFormElement>)=>void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
