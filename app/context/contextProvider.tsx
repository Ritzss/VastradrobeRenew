/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppContext, CartItem, LoginData, RegisterData } from "./AppContext";
import { IMSProduct } from "@/Types/Product";
import { useRouter } from "next/navigation";
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

  /* 🛒 Cart */
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /*Product Details */
  const [showVariants, setShowVariants] = useState<boolean>(true);
  const [showProductDeatils, setShowProductDeatils] = useState<boolean>(false);

  /* ❤️ Favorites (DB-backed) */
  const [favCollections, setFavCollections] = useState<
    Record<string, Set<number>>
  >({});

  /* ---------------- CART ---------------- */

  const clearCart = () => setCartItems([]);

  const addToCart = (productId: number, size: string) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === productId && i.size === size,
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, qty: i.qty + 1 }
            : i,
        );
      }

      return [...prev, { productId, size, qty: 1 }];
    });

    toast.success(`Item Added to cart`);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
    toast.error(`Item Removed from cart`);
  };

  const incrementQty = (productId: number, size: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, qty: i.qty + 1 }
          : i,
      ),
    );
  };

  const decrementQty = (productId: number, size: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, qty: i.qty - 1 }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

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

      Object.entries(data.favorites || {}).forEach(([collection, ids]: any) => {
        parsed[collection] = new Set(ids);
      });
    }

    setFavCollections(parsed);
  };

  const createCollection = async (collection: string) => {
    // no API needed yet, collection auto-created on add
    setFavCollections((prev) => ({
      ...prev,
      [collection]: new Set(),
    }));
    toast.success(`New Collection ${collection} Cretated`);
  };

  const addToCollection = async (collection: string, id: number) => {
    await fetch("/api/favorites/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, productId: id }),
    });
    await loadFavorites();
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
    await loadFavorites();
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

  const handleRegister = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // backend failed before JSON
      }

      if (!res.ok) {
        toast.error(data?.message || "Registration failed");
        return false;
      }

      toast.success("Account created");

      setRegisterForm({ username: "", email: "", password: "" });

      // hydrate auth state FIRST
      await loadUser();

      return true;
    } catch {
      toast.error("Server error. Please try again.");
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // backend died before JSON, fine
      }

      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        return false;
      }

      toast.success("Logged in successfully");

      // ensure auth state updates BEFORE redirect
      await loadUser();

      return true;
    } catch {
      toast.error("Server error. Please try again.");
      return false;
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setFavCollections({});
    router.replace("/");
  };
  /**-------------------Product Load---------------- */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?page=1&limit=20`);
        const data = await res.json();
        setProducts(data.products); // only if you have local state
      } catch (err) {
        toast.error(`Failed to load products ${err}`);
      }
    };
    loadProducts();
  }, []);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadUser().finally(() => setAuthLoading(false));
  }, []);

  /* ---------------- CART HYDRATION ---------------- */
  useEffect(() => {
    const hydrateCart = async () => {
      // 🔐 Logged-in user → load from DB
      if (user) {
        try {
          const res = await fetch("/api/cart", {
            credentials: "include",
          });

          if (!res.ok) return;

          const data = await res.json();

          // ✅ cart is ARRAY
          setCartItems(Array.isArray(data.cart) ? data.cart : []);
        } catch (err) {
          console.error("Failed to load cart from DB", err);
        }
      }

      // 👤 Guest → load from localStorage
      else {
        const stored = localStorage.getItem("vastradrobe_cart");
        if (!stored) return;

        try {
          const parsed = JSON.parse(stored);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } catch {
          localStorage.removeItem("vastradrobe_cart");
        }
      }
    };

    hydrateCart();
  }, [user]);

  /* ---------------- CART PERSISTENCE ---------------- */
  useEffect(() => {
    if (!user) return;

    fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${document.cookie}`, // or however you pass token
      },
      body: JSON.stringify({ cart: cartItems }),
    });
  }, [cartItems, user]);

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
        showVariants,
        setShowVariants,
        showProductDeatils,
        setShowProductDeatils,

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
