"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppContext, LoginData, RegisterData } from "./AppContext";
import { Product } from "@/Types/Product";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/Types/AuthUser";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  /* ---------------- AUTH ---------------- */

  /* ---------------- SEARCH / FILTER ---------------- */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectGender, setSelectGender] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Map<number, number>>(new Map());
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ❤️ FAVORITES */
  const [favCollections, setFavCollections] = useState<
    Record<string, Set<number>>
  >({
    Favorites: new Set(), // default collection
  });

  const clearCart = () => {
    setCartItems(new Map());
  };

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
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setRegisterForm({ username: "", email: "", password: "" });
      await loadUser();
      router.push("/"); // or wherever you want after login
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email, // 🔴 LOGIN IS BY EMAIL
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ success
      setLoginForm({ email: "", password: "" });
      await loadUser();
      router.push("/"); // or dashboard / profile
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error();

      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };
  const loadCart = async () => {
    const res = await fetch("/api/cart");
    if (!res.ok) return;

    const data = await res.json();

    const map = new Map<number, number>();
    data.cart.forEach((item: any) => {
      map.set(item.productId, item.qty);
    });

    setCartItems(map);
  };

  /**
   * Use EFFECTS
   *
   */
  useEffect(() => {
    const init = async () => {
      try {
        await loadUser();

        // 🔥 LOAD CART ONLY IF USER EXISTS
        if (user) {
          await loadCart();
        }
      } finally {
        setAuthLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;

    const cartArray = Array.from(cartItems.entries()).map(
      ([productId, qty]) => ({ productId, qty })
    );

    fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: cartArray }),
    });
  }, [cartItems, user]);

  /**
   * USE EFFECTS END
   *
   */

  return (
    <AppContext.Provider
      value={{
        /* auth */
        authLoading,
        setAuthLoading,
        user,
        setUser,

        /* search / filter */
        searchQuery,
        setSearchQuery,
        selectGender,
        setSelectGender,
        subCategory,
        setSubCategory,

        /* cart (SINGLE SOURCE OF TRUTH) */
        cartItems,
        clearCart,
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
        handleLogout,
        loadUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
