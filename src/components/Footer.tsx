import { ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-t-gray-600">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <Link
              href={`/`}
              className="text-xl font-bold text-emerald-400 flex items-center"
            >
              <ShoppingBasketIcon className="size-8 mr-1 mb-1 font-bold" />
              KR-Store
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400 lg:mt-0 lg:text-right">
            Copyright &copy; {year}. All rights reserved. |{" "}
            <span className="text-emerald-400">Kareem Roshdy ❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
