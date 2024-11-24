"use client";

import toast from "react-hot-toast";
import { Loader, ShoppingCart } from "lucide-react";
import { Product } from "@/store/use-product-store";
import Image from "next/image";
import { useUserStore } from "@/store/use-user-store";
import { useCartStore } from "@/store/use-cart-store";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useUserStore();

  const { addToCart, loading } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add product to your cart", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-80 overflow-hidden rounded-xl">
        <Image
          fill
          className="object-contain w-full z-10"
          src={product.image}
          alt="product-Image"
        />
        <div className="absolute inset-0 bg-white -z-10" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>

        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>

        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart size={22} className="mr-2" />
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
