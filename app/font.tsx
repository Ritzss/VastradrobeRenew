import {
  Caveat,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Pacifico,
} from "next/font/google";

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-handwriting",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
