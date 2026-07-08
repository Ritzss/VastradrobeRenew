'use client'
import { useEffect, useState } from "react";
import LandingLoader from "./components/Loaders/LandingLoaders";

export default function Loading() {
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
  
      const load = async () => {
        await document.fonts.ready;
  
        setTimeout(() => {
          requestAnimationFrame(() => {
          setLoading(false);
      });
        }, 1800);
      };
  
      load();
    }, []);
  return (
    <LandingLoader loading={loading} />
  );
}
