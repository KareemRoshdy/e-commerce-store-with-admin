import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import Navbar from "@/components/navbar/navbar";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { verifyTokenForPages } from "@/utils/verifyToken";
import { getCartItems } from "@/actions/get-cart-items";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar/navbar"));

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KR-Store",
  description: "E-Commerce Store by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("accessToken")?.value as string;

  const user = await verifyTokenForPages(token);

  const cart = user ? await getCartItems(user.id) : [];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Toaster />
        <main className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
            </div>
          </div>
          <div className="relative z-50 pt-20">
            <Navbar cart={cart} user={user} token={token} />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
