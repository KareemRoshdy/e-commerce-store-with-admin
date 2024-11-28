"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Loader } from "lucide-react";
import { Product, User } from "@prisma/client";

interface CategoryPageProps {
  categoryName: string;
  products: Product[];
  user: User;
}

const CategoryPage = ({ products, categoryName, user }: CategoryPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </motion.h1>

        {!products ? (
          <div className="flex items-center justify-center">
            <Loader className="size-6 animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cold-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <>
              {products?.length === 0 && (
                <h2 className="text-3xl font-semibold to-gray-300 text-center col-span-full">
                  No products found
                </h2>
              )}

              {products?.map((product) => (
                <ProductCard key={product.id} product={product} user={user} />
              ))}
            </>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
