/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "./font";
import ClientLayout from "./ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
// import Image from "next/image";
// import FacebookPixel from "./components/Global/FacebookPixel";
// import { Suspense } from "react";


export const metadata: Metadata = {
  metadataBase: new URL("https://vastradrobe.com"),

  title: {
    default: "VastraDrobe | Premium Women's Fashion & Ethnic Wear Online",
    template: "%s | VastraDrobe",
  },

  description:
    "Discover premium women's fashion at VastraDrobe. Shop elegant ethnic wear, western wear, dresses, co-ord sets, tops, kurtas, festive collections, and everyday essentials with secure shopping and fast delivery across India.",

  applicationName: "VastraDrobe",

  keywords: [
  "VastraDrobe",

  // Brand
  "VastraDrobe fashion",
  "VastraDrobe online shopping",

  // Women's Fashion
  "women fashion online",
  "women clothing online India",
  "ladies clothing online",
  "women western wear",
  "western wear for women",
  "latest women's fashion",
  "women apparel online",

  // Co-ord Sets
  "women co-ord sets online",
  "women co-ord sets online India",
  "co-ord sets for women",
  "formal co-ord sets for women",
  "office wear co-ord sets",
  "cotton co-ord sets for women",
  "printed co-ord sets",
  "party wear co-ord sets",
  "summer co-ord sets",
  "girls co-ord sets online",

  // Tops
  "tops for women",
  "designer tops",
  "casual tops for women",
  "office tops for women",
  "cotton tops for women",

  // Ethnic
  "ethnic wear for women",
  "ethnic dresses",
  "kurti online",
  "kurta sets",
  "Indian ethnic wear",
  "festive wear for women",

  // Dresses
  "dresses for women",
  "party wear dresses",
  "casual dresses",
  "maxi dresses",
  "summer dresses",

  // Occasion
  "office wear for women",
  "casual wear for women",
  "party wear for women",
  "vacation wear",
  "everyday fashion",

  // Regional
  "women western wear in Gurugram",
  "women clothing in Gurugram",
  "fashion store Gurugram",
  "online fashion store India",

  // Shopping Intent
  "buy women clothing online",
  "premium women's clothing",
  "designer clothing online",
  "online fashion shopping India",
  "best online clothing store",
  "affordable luxury fashion",
],

  authors: [
    {
      name: "VastraDrobe",
      url: "https://vastradrobe.com",
    },
  ],

  creator: "VastraDrobe",

  publisher: "VastraDrobe",

  category: "Fashion",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "VastraDrobe | Premium Women's Fashion",
    description:
      "Discover timeless fashion with premium ethnic wear, western wear, co-ord sets, dresses and everyday essentials at VastraDrobe.",

    url: "https://vastradrobe.com",

    siteName: "VastraDrobe",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VastraDrobe Premium Fashion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VastraDrobe | Premium Women's Fashion",
    description:
      "Shop premium ethnic wear, western wear, dresses, co-ord sets and timeless fashion at VastraDrobe.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  // themeColor: "#6a0f1f",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
        geistSans.className,
      ].join(" ")}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://vastradrobe-ims.vercel.app" />
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EL969VRVJR"
        />
        <Script
          id="gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-EL969VRVJR');
            `,
          }}
        />
        
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq) return;
                n=f.fbq=function(){n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
                if(!f._fbq) f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1564638015182431');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1564638015182431&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body className="dark:bg-black light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] overflow-hidden" cz-shortcut-listen="true">
        {/* <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1714368985941051');
            fbq('track', 'PageView');
          `}
        </Script>

        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense> */}

        <ClientLayout>{children}</ClientLayout>

        <SpeedInsights />

        <Analytics/>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1714368985941051&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
