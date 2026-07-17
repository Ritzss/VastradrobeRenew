"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { IMSProduct } from "@/Types/Product";
import { AuthUser } from "@/Types/AuthUser";

export type LoginData = {
  identifier: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  mobile: string;
  password: string;
};

export type CartItem = {
  productId: number;
  size: string;
  color: string;
  qty: number;
};

export type PriceRange = {
  min: number | "";
  max: number | "";
};
export interface AppContextType {
  /* 🔍 Search & Filter */
  selectGender: string;
  setSelectGender: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  subCategory: string;
  setSubCategory: Dispatch<SetStateAction<string>>;
  sizes: string[];
  setSizes: Dispatch<SetStateAction<string[]>>;
  priceRange: PriceRange;
  setPriceRange: Dispatch<SetStateAction<PriceRange>>;
  showVariants: boolean;
  setShowVariants: Dispatch<SetStateAction<boolean>>;
  showProductDeatils: boolean;
  setShowProductDeatils: Dispatch<SetStateAction<boolean>>;

  /* 🛒 Cart */
  cartItems: CartItem[];
  savedForLater: CartItem[];
  cartCount: number;
  saveForLater: (productId: number, size: string, color: string,)=> Promise<void>;
  moveToCart: (productId: number, size: string, color: string) => Promise<void>;
  removeSavedForLater: (productId: number, size: string, color: string)=> Promise<void>;
  clearCart: () => void;
  addToCart: (productId: number, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  incrementQty: (productId: number, size: string, color: string) => void;
  decrementQty: (productId: number, size: string, color: string) => void;

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
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
