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

export type CartItem = {
  productId: number;
  size: string;
  qty: number;
};

export interface AppContextType {
  /* 🔍 Search & Filter */
  selectGender: string;
  setSelectGender: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  subCategory: string;
  setSubCategory: Dispatch<SetStateAction<string>>;
  showVariants: boolean;
  setShowVariants: Dispatch<SetStateAction<boolean>>;
  showProductDeatils: boolean;
  setShowProductDeatils: Dispatch<SetStateAction<boolean>>;

  /* 🛒 Cart */
  cartItems: CartItem[];
  cartCount: number;
  clearCart: () => void;
  addToCart: (productId: number, size: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  incrementQty: (productId: number, size: string) => void;
  decrementQty: (productId: number, size: string) => void;

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
  handleRegister: (e: React.FormEvent) => Promise<boolean>;
  handleLogin: (e: React.FormEvent) => Promise<boolean>;
  handleLogout: () => void;
  loadUser: () => Promise<void>;
  authLoading: boolean;
  user: AuthUser | null;
}

export const AppContext = createContext<AppContextType | undefined>(
  undefined
);
