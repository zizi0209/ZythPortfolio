import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { portfolioConfig } from "@/config/portfolio.config";

import BuyMeCoffee from "@/components/buy-me-coffee";
import SmoothFollower from "@/components/cursor/smooth-follower";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  metadataBase: new URL(portfolioConfig.seo.url),
  title: {
    default: portfolioConfig.name,
    template: `%s - ${portfolioConfig.title}`,
  },
  description: portfolioConfig.description,

  // added new keywords for seo
  keywords: portfolioConfig.seo.keywords,
  authors: portfolioConfig.seo.authors,
  creator: portfolioConfig.name,

  openGraph: {
    type: "website",
    locale: "en_US",
    url: portfolioConfig.seo.url,
    title: portfolioConfig.name,
    description: portfolioConfig.description,
    images: [`${portfolioConfig.seo.url}/og-image.jpg`],
    siteName: portfolioConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioConfig.name,
    description: portfolioConfig.description,
    images: [`${portfolioConfig.seo.url}/og-image.jpg`],
    creator: portfolioConfig.seo.twitterHandle,
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${rubik.variable}`}>
        <main
          className={cn(
            "relative flex h-dvh min-h-screen items-center justify-between pt-14 pb-4 px-40 max-md:p-4 max-sm:pt-20 bg-transparent"
          )}
        >
          {/* BG effect – không ảnh hưởng layout */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#2F9E81]" />
            <div
              className="absolute inset-0
              bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]
              bg-[size:20px_20px]
              [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
              [-webkit-mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
            "
            />
            <div
              className="absolute inset-0
              bg-[radial-gradient(125%_125%_at_50%_10%,rgba(99,102,241,0.3)_40%,rgba(15,23,42,1)_100%)]
            "
            />
          </div>

          {/* NAVBAR -> */}
          <Navbar />
          {children}
          <SmoothFollower />
          <BuyMeCoffee />
        </main>
      </body>
    </html>
  );
}
