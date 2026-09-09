"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  subtitle: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
};

/**
 * 👑 CENTRAL COMPONENT: Section Header (Nangalia Ruchira Theme)
 * 
 * Standardizes and unifies all page and grid category section headings across VastraDrobe!
 * Replaces dozens of duplicated markup blocks on Home, Collection, and Blogs.
 */
export default function SectionHeader({
  subtitle,
  title,
  description,
  className = "",
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col ${alignClass} space-y-2 select-none ${className}`}
    >
      {/* Category Subtitle */}
      <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
        {subtitle}
      </p>

      {/* Main Title (Luxurious Serif) */}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
        {title}
      </h2>

      {/* Narrative storytelling description */}
      {description && (
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-xs font-light font-sans tracking-wide leading-relaxed pt-2">
          {description}
        </p>
      )}
    </motion.div>
  );
}
