/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  AppContext,
  CartItem,
  LoginData,
  PriceRange,
  RegisterData,
} from "./AppContext";
import { IMSProduct } from "@/Types/Product";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/Types/AuthUser";
import { toast } from "sonner";
import { fbPixel } from "@/lib/facebookpixel";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  /* 🔍 Search & Filter */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: "",
    max: "",
  });
  const [sizes, setSizes] = useState<string[]>([]);

  /* 📦 Products */
  const [products, setProducts] = useState<IMSProduct[]>([]);

  /* 🔐 Auth */
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* 🎬 Animation Coordination */
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);

  /* 🌗 Theme (Circular Grow Transition) */
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load and apply theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("vastradrobe_theme") as
      | "light"
      | "dark"
      | null;
    const initialTheme = storedTheme || "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Perform the circular clip-path expansion View Transition
  const toggleTheme = (event: React.MouseEvent) => {
    const targetTheme = theme === "light" ? "dark" : "light";

    // Fallback if browser doesn't support the View Transition API
    if (!(document as any).startViewTransition) {
      setTheme(targetTheme);
      localStorage.setItem("vastradrobe_theme", targetTheme);
      if (targetTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return;
    }

    // Get click coordinate relative to page for circle's anchor point
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(targetTheme);
      localStorage.setItem("vastradrobe_theme", targetTheme);
      if (targetTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: targetTheme === "dark" ? clipPath : clipPath.reverse(),
        },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement:
            targetTheme === "dark"
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
        },
      );
    });
  };

  /* 🛒 Cart */
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{
    product: IMSProduct;
    variant: IMSProduct["variants"][number];
    size: string;
    qty: number;
  } | null>(null);

  /*Product Details */
  const [showVariants, setShowVariants] = useState<boolean>(true);
  const [showProductDeatils, setShowProductDeatils] = useState<boolean>(false);

  /* ❤️ Favorites (DB-backed) */
  const [favCollections, setFavCollections] = useState<
    Record<string, Set<number>>
  >({});

  /* ---------------- CART ---------------- */

  const clearCart = () => setCartItems([]);

  const addToCart = (productId: number, size: string, color: string ,design: string = "") => {
    const product = products.find((p) => p.productId === productId);

    const selectedVariant =
      product?.variants.find(
        (v) => v.color.toLowerCase() === color.toLowerCase(),
      ) ??
      product?.variants[0] ??
      null;

    if (product) {
      setLastAddedProduct({
        product,
        variant: selectedVariant ?? product.variants[0],
        size,
        qty: 1,
      });

      // Give the cart icon time to animate before
      // opening the cart drawer.
      setTimeout(() => {
        setCartDrawerOpen(true);
      }, 400);
    }

    fbPixel.addToCart({
      id: String(productId),
      name: product?.name ?? "Unknown Product",
      price: product?.price ?? 0,
    });

    // A product without designs simply stores an empty string.
    const cartDesign = design || "";

    setCartItems((prev) => {
      // Product + color + design + size uniquely identifies
      // the selected cart variant.
      const existing = prev.find(
        (i) =>
          i.productId === productId &&
          i.size === size &&
          i.color === color &&
          i.design === cartDesign,
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === productId &&
          i.size === size &&
          i.color === color &&
          i.design === cartDesign
            ? {
                ...i,
                qty: i.qty + 1,
              }
            : i,
        );
      }

      return [
        ...prev,
        {
          productId,
          size,
          color,
          design: cartDesign,
          qty: 1,
        },
      ];
    });

    toast.success("Item Added to cart");
  };

  const removeFromCart = (productId: number, size: string, color: string, design: string = "") => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.size === size && i.color === color && i.design === design),
      ),
    );

    toast.error("Item Removed from cart");
  };

  const incrementQty = (productId: number, size: string, color: string) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && i.size === size && i.color === color) {
          if (i.qty >= 10) {
            toast.error("Maximum quantity is 10");
            return i;
          }
          return { ...i, qty: i.qty + 1 };
        }
        return i;
      }),
    );
  };

  const decrementQty = (productId: number, size: string, color: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, qty: i.qty - 1 }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const saveForLater = async (
    productId: number,
    size: string,
    color: string,
  ) => {
    const res = await fetch("/api/cart/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        size,
        color,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed");
      return;
    }

    setCartItems(data.cart);
    setSavedForLater(data.savedForLater);

    toast.success("Moved to Saved for Later");
  };

  const moveToCart = async (productId: number, size: string, color: string) => {
    const res = await fetch("/api/cart/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        size,
        color,
      }),
    });

    if (!res.ok) {
      toast.error("Failed");
      return;
    }

    const data = await res.json();

    setCartItems(data.cart);
    setSavedForLater(data.savedForLater);

    toast.success("Moved to Cart");
  };

  const removeSavedForLater = async (
    productId: number,
    size: string,
    color: string,
  ) => {
    const res = await fetch("/api/cart/remove-saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        size,
        color,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to remove item");
      return;
    }

    const data = await res.json();

    setCartItems(data.cart);
    setSavedForLater(data.savedForLater);

    toast.success("Removed from Saved for Later");
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
    identifier: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    username: "",
    email: "",
    mobile: "",
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

      setRegisterForm({ username: "", email: "", password: "", mobile: "" });

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?page=1&limit=50`,
        );
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
          setSavedForLater(
            Array.isArray(data.savedForLater) ? data.savedForLater : [],
          );
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
      body: JSON.stringify({ cart: cartItems, savedForLater }),
    });
  }, [cartItems, savedForLater, user]);

  useEffect(() => {
    if (!user) return;
    loadFavorites().then(async () => {
      try {
        const pendingIdStr = localStorage.getItem("pendingFavoriteProductId");
        if (pendingIdStr) {
          const id = Number(pendingIdStr);
          if (!isNaN(id)) {
            await addToCollection("Favorites", id);
            toast.success("Added your pending item to default folder!");
          }
          localStorage.removeItem("pendingFavoriteProductId");
        }
      } catch (err) {
        console.error("Hydrating pending favorite failed:", err);
      }
    });
  }, [user]);

  /* ---------------- PROVIDER ---------------- */

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectGender,
        setSelectGender,
        selectedCategory,
        setSelectedCategory,
        subCategory,
        setSubCategory,
        priceRange,
        setPriceRange,
        sizes,
        setSizes,
        sortBy,
        setSortBy,
        theme,
        toggleTheme,

        cartItems,
        cartCount,
        clearCart,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        savedForLater,
        saveForLater,
        moveToCart,
        removeSavedForLater,
        cartDrawerOpen,
        setCartDrawerOpen,
        lastAddedProduct,
        setLastAddedProduct,

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
        setUser,
        isLoaderFinished,
        setIsLoaderFinished,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
