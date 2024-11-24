import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import prisma from "@/utils/db";
import { stripe } from "@/utils/stripe";
import { createNewCoupon } from "@/utils/create-new-coupon";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/payment/create-checkout-session
 * @desc    create checkout session
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    // Verify the user token
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const { products, couponCode } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty products array" },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          userId: userPayload.userId,
        },
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.DOMAIN_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: userPayload.userId.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product.id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(userPayload.userId);
    }

    return NextResponse.json(
      { id: session.id, totalAmount: totalAmount / 100 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

const createStripeCoupon = async (
  discountPercentage: number
): Promise<string> => {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });

    console.log(coupon.id);

    return coupon.id;
  } catch {
    throw new Error("Failed to create Stripe coupon.");
  }
};
