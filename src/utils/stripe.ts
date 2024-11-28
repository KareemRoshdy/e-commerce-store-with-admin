import Stripe from "stripe";
import env from "dotenv";
env.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
