"use client";

import { ProductsInCart } from "@/types";
import { User } from "@prisma/client";
import Link from "next/link";

import {
  ShoppingCart,
  UserPlus,
  LogIn,
  Lock,
  ShoppingBasketIcon,
} from "lucide-react";
import LogoutButton from "./logout-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

interface NavbarProps {
  user: User | null;
  cart: ProductsInCart[] | null;
}

const Navbar = ({ user, cart }: NavbarProps) => {
  const router = useRouter();

  const logout = async () => {
    await axios.post("/api/auth/logout");
  };

  useEffect(() => {
    if (!user) {
      logout();
      router.refresh();
    }
  }, [user, router]);

  const isAdmin = user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            href={`/`}
            className="text-2xl font-bold text-emerald-400 flex items-center space-x-2"
          >
            <ShoppingBasketIcon className="size-8 mr-1 mb-1 font-bold" />
            KR-Store
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href={`/`}
              className="text-fray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              <Link
                href={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
          ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>

                {cart && cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                  text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                href={"/dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <LogoutButton />
            ) : (
              <>
                <Link
                  href={"/auth/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  href={"/auth/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
