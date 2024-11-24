"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/use-user-store";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { motion } from "framer-motion";
import EmptyCartUI from "./_components/EmptyCartUI";
import CartItem from "./_components/CartItem";
import PeopleAlsoBought from "./_components/PeopleAlsoBought";
import OrderSummary from "./_components/OrderSummary";
import GiftCouponCard from "./_components/GiftCouponCard";

const CartPage = () => {
  const { user, checkAuth } = useUserStore();
  const { cart } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
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
                  <OrderSummary />
                  <GiftCouponCard />
                </motion.div>
              )}
            </div>

            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          <div className="lg:block hidden">
            {cart.length > 0 && (
              <motion.div
                className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <OrderSummary />
                <GiftCouponCard />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
