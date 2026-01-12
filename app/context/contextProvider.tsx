"use client";

import { MouseEvent, ReactNode, useState } from "react";
import { AppContext, LoginData, RegisterData } from "./AppContext";
import { Product } from "@/Types/Product";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  /* ---------------- AUTH ---------------- */
  const [islogged, setIsLogged] = useState<boolean>(false);

  /* ---------------- SEARCH / FILTER ---------------- */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectGender, setSelectGender] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Map<number, number>>(new Map());

  /* ❤️ FAVORITES */
  const [favCollections, setFavCollections] = useState<Record<string, Set<number>>>({
  Favorites: new Set(), // default collection
});

const createCollection = (name: string) => {
  setFavCollections((prev) => ({
    ...prev,
    [name]: new Set(),
  }));
};

const addToCollection = (collection: string, id: number) => {
  setFavCollections((prev) => {
    const next = { ...prev };
    next[collection] = new Set(next[collection]).add(id);
    return next;
  });
};

const removeFromCollection = (collection: string, id: number) => {
  setFavCollections((prev) => {
    const next = { ...prev };
    const set = new Set(next[collection]);
    set.delete(id);
    next[collection] = set;
    return next;
  });
};


  const addToCart = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const incrementQty = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 1) + 1);
      return next;
    });
  };

  const decrementQty = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      const current = next.get(id) || 1;
      if (current > 1) next.set(id, current - 1);
      return next;
    });
  };

  const cartCount = Array.from(cartItems.values()).reduce(
    (sum, qty) => sum + qty,
    0
  );

  /* ---------------- FORMS ---------------- */
  const [loginForm, setLoginForm] = useState<LoginData>({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRegisterForm({ username: "", email: "", password: "" });
  };

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoginForm({ username: "", password: "" });
  };

  return (
    <AppContext.Provider
      value={{
        /* auth */
        islogged,
        setIsLogged,

        /* search / filter */
        searchQuery,
        setSearchQuery,
        selectGender,
        setSelectGender,
        subCategory,
        setSubCategory,

        /* cart (SINGLE SOURCE OF TRUTH) */
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        favCollections,
        createCollection,
        addToCollection,
        removeFromCollection,
        products,
        setProducts,

        /* forms */
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
