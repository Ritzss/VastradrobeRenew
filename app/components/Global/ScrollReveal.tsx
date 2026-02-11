"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  once?: boolean;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

const ScrollReveal = ({
  children,
  once = true,
  direction = "up",
  delay = 0,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  const hiddenTransform = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out
        ${
          visible
            ? "opacity-100 translate-x-0 translate-y-0"
            : `opacity-0 ${hiddenTransform[direction]} pointer-events-none`
        }`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
