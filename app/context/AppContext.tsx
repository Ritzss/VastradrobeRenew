"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { Product } from "@/Types/Product";
import { AuthUser } from "@/Types/AuthUser";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export interface AppContextType {
  /* 🔍 Search & Filter */
  selectGender: string;
  setSelectGender: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  subCategory: string;
  setSubCategory: Dispatch<SetStateAction<string>>;

  /* 🛒 Cart (FIXED) */
  cartItems: Map<number, number>;
  cartCount: number;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  incrementQty: (id: number) => void;
  decrementQty: (id: number) => void;
  favCollections: Record<string, Set<number>>;
  addToCollection: (collection: string, id: number) => void;
  removeFromCollection: (collection: string, id: number) => void;
  createCollection: (collection: string) => void;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;

  /* 🔐 Auth */
  loginForm: LoginData;
  setLoginForm: Dispatch<SetStateAction<LoginData>>;
  registerForm: RegisterData;
  setRegisterForm: Dispatch<SetStateAction<RegisterData>>;
  handleRegister: (e: React.FormEvent) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleLogout: (e: React.FormEvent) => void;
  authLoading:boolean;
  setAuthLoading:Dispatch<SetStateAction<boolean>>;
  user:AuthUser | null;
  setUser:Dispatch<SetStateAction<AuthUser | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
