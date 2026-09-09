"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  rootMargin?: string;
  placeholderHeight?: number;
};

export default function LazySection({
  children,
  rootMargin = "300px",
  placeholderHeight = 500,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref}>
      {mounted ? (
        children
      ) : (
        <div
          style={{
            height: placeholderHeight,
          }}
        />
      )}
    </div>
  );
}