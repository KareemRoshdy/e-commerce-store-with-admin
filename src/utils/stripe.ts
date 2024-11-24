import Stripe from "stripe";
import env from "dotenv";
env.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createStripeCoupon = async (
//   discountPercentage: number
// ): Promise<string> => {
//   try {
//     const coupon = await stripe.coupons.create({
//       percent_off: discountPercentage,
//       duration: "once",
//     });

//     console.log(coupon.id);

//     return coupon.id;
//   } catch (error: any) {
//     console.error("Error creating coupon:", error.message, error);
//     throw new Error("Failed to create Stripe coupon.");
//   }
// };
