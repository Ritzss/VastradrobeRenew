/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "./font";
import ClientLayout from "./ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
// import Image from "next/image";
// import FacebookPixel from "./components/Global/FacebookPixel";
// import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "VastraDrobe",
    template: "%s | VastraDrobe",
  },
  description:
    "Shop premium fashion, ethnic wear, western wear, co-ord sets and latest trends at VastraDrobe.",

  keywords: [
    "women fashion",
    "ethnic wear",
    "western wear",
    "co ord sets",
    "vastradrobe",
    "online shopping",
  ],

  openGraph: {
    title: "VastraDrobe",
    description: "Shop premium fashion and latest trends at VastraDrobe.",
    url: "https://vastradrobe.com",
    siteName: "VastraDrobe",
    locale: "en_US",
    type: "website",
  },
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

      <body className="bg-[#f9f5ef] overflow-hidden" cz-shortcut-listen="true">
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
