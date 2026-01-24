/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppContext, LoginData, RegisterData } from "./AppContext";
import { IMSProduct } from "@/Types/Product";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthUser } from "@/Types/AuthUser";
import { toast } from "sonner";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  /* 🔍 Search & Filter */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [subCategory, setSubCategory] = useState("");

  /* 📦 Products */
  const [products, setProducts] = useState<IMSProduct[]>([]);

  /* 🔐 Auth */
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  /* 🛒 Cart */
  const [cartItems, setCartItems] = useState<Map<number, number>>(new Map());

  /* ❤️ Favorites (DB-backed) */
  const [favCollections, setFavCollections] = useState<
    Record<string, Set<number>>
  >({});

  /* ---------------- CART ---------------- */

  const clearCart = () => setCartItems(new Map());

  const addToCart = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
    toast.success(`item is added to cart`)
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    toast.error(`item is removed to cart`)
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

  /* ---------------- FAVORITES (API) ---------------- */

  const loadFavorites = async () => {
  const res = await fetch("/api/favorites", {
    credentials: "include",
  });

  const parsed: Record<string, Set<number>> = {
    Favorites: new Set(), // 👈 DEFAULT
  };

  if (res.ok) {
    const data = await res.json();

    Object.entries(data.favorites || {}).forEach(
      ([collection, ids]: any) => {
        parsed[collection] = new Set(ids);
      }
    );
  }

  setFavCollections(parsed);
};


  const createCollection = async (collection: string) => {
    // no API needed yet, collection auto-created on add
    setFavCollections((prev) => ({
      ...prev,
      [collection]: new Set(),
    }));
    toast.success(`New Collection ${collection} Cretated`)
  };

  const addToCollection = async (collection: string, id: number) => {
    await fetch("/api/favorites/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, productId: id }),
    });

    setFavCollections((prev) => {
      const next = { ...prev };
      next[collection] = new Set(next[collection] || []).add(id);
      return next;
    });
  };

  const removeFromCollection = async (collection: string, id: number) => {
    await fetch("/api/favorites/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, productId: id }),
    });

    setFavCollections((prev) => {
      const next = { ...prev };
      const set = new Set(next[collection]);
      set.delete(id);
      next[collection] = set;
      return next;
    });
  };

  /* ---------------- AUTH ---------------- */

  const [loginForm, setLoginForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerForm),
  });

  if (!res.ok) {
    const data = await res.json();
    toast.error(data.message || "Registration failed");
    return;
  }

  setRegisterForm({ username: "", email: "", password: "" });
  toast.success("Account created");

  router.replace("/");

  setTimeout(() => {
    loadUser();
  }, 0);
};


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      // ⬇️ THIS is the critical part
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // backend crashed before sending JSON
      }

      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully");

      router.replace(safeRedirect);

      // hydrate user AFTER navigation
      setTimeout(() => {
        loadUser();
      }, 0);
    } catch {
      toast.error("Server error. Please try again.");
    }
  };


  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setFavCollections({});
     router.replace("/");
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadUser().finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    loadFavorites();
  }, [user]);

  /* ---------------- PROVIDER ---------------- */

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectGender,
        setSelectGender,
        subCategory,
        setSubCategory,

        cartItems,
        cartCount,
        clearCart,
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

        loginForm,
        setLoginForm,
        registerForm,
        setRegisterForm,
        handleRegister,
        handleLogin,
        handleLogout,
        loadUser,
        authLoading,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
