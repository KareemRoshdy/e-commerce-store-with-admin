"use client";

import { motion } from "framer-motion";

import CartItem from "./CartItem";
import EmptyCartUI from "./EmptyCartUI";
import GiftCouponCard from "./GiftCouponCard";
import OrderSummary from "./OrderSummary";
import PeopleAlsoBought from "./PeopleAlsoBought";
import { ProductsInCart, RecommendationProducts } from "@/types";
import { User } from "@prisma/client";

interface CartProps {
  cart: ProductsInCart[] | [];
  recommendations: RecommendationProducts[];
  user: User;
}

const Cart = ({ cart, recommendations, user }: CartProps) => {
  return (
    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
      <motion.div
        className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cart.length === 0 ? (
          <EmptyCartUI />
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="lg:hidden block">
          {cart.length > 0 && (
            <motion.div
              className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary cart={cart} />
              <GiftCouponCard />
            </motion.div>
          )}
        </div>

        {cart.length > 0 && (
          <PeopleAlsoBought recommendations={recommendations} user={user} />
        )}
      </motion.div>

      <div className="lg:block hidden">
        {cart.length > 0 && (
          <motion.div
            className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <OrderSummary cart={cart} />
            <GiftCouponCard />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
