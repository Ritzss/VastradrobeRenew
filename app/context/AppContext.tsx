"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { IMSProduct } from "@/Types/Product";
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

  /* 🛒 Cart */
  cartItems: Map<number, number>;
  cartCount: number;
  clearCart: () => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  incrementQty: (id: number) => void;
  decrementQty: (id: number) => void;

  /* ❤️ Favorites (DB-backed) */
  favCollections: Record<string, Set<number>>;
  createCollection: (collection: string) => Promise<void>;
  addToCollection: (collection: string, id: number) => Promise<void>;
  removeFromCollection: (collection: string, id: number) => Promise<void>;

  /* 📦 Products */
  products: IMSProduct[];
  setProducts: Dispatch<SetStateAction<IMSProduct[]>>;

  /* 🔐 Auth */
  loginForm: LoginData;
  setLoginForm: Dispatch<SetStateAction<LoginData>>;
  registerForm: RegisterData;
  setRegisterForm: Dispatch<SetStateAction<RegisterData>>;
  handleRegister: (e: React.FormEvent) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleLogout: () => void;
  loadUser: () => Promise<void>;
  authLoading: boolean;
  user: AuthUser | null;
}

export const AppContext = createContext<AppContextType | undefined>(
  undefined
);
