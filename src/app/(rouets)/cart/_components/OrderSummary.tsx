"use client";

import { useCartStore } from "@/store/use-cart-store";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios";
import { ProductsInCart } from "@/types";

const stripePromise = loadStripe(
  "pk_test_51Q7MdpDOkfiu0yN4IITZf60xKElKBQtKhh49fkLD3WSzxQlPNwC2NxETTSxf2w5VR2ZWjAI3LQAlCQlogkw1ZjVJ00bwvO42Tt"
);

interface OrderSummaryProps {
  cart: ProductsInCart[] | [];
}

const OrderSummary = ({ cart }: OrderSummaryProps) => {
  const { coupon, isCouponApplied } = useCartStore();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity!,
    0
  );

  let total = subtotal;
  if (isCouponApplied && coupon) {
    const discount = total * (coupon.discountPercentage / 100);
    total = subtotal - discount;
  }

  const savings = subtotal - total;

  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payment/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = res.data;
    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      console.log("Error", result.error);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                ${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-normal text-gray-300">Total</dt>
            <dd className="text-base font-medium text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-0 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
