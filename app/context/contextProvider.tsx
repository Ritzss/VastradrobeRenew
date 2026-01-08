"use client";

import { FormEvent, ReactNode, useState } from "react";
import { AppContext, LoginData, RegisterData } from "./AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRegisterForm({ username: "", email: "", password: "" });
  };

  const handleLogin = (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    setLoginForm({username:"",password:""})

  }

  const [islogged, setIsLogged] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  return (
    <AppContext.Provider
      value={{
        islogged,
        setIsLogged,
        loginForm,
        setLoginForm,
        registerForm,
        setRegisterForm,
        handleRegister,
        handleLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
