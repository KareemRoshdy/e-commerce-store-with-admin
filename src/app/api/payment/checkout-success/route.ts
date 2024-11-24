import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import prisma from "@/utils/db";
import { stripe } from "@/utils/stripe";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/payment/checkout-success
 * @desc    create order if checkout success
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

    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.metadata) {
      if (session.metadata?.couponCode) {
        await prisma.coupon.update({
          where: {
            userId: session.metadata.userId,
          },
          data: {
            isActive: false,
          },
        });
      }

      // Create a new order
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId: session.metadata.userId,
        },
      });

      if (!cartItem) {
        return NextResponse.json(
          { message: "not found products" },
          { status: 404 }
        );
      }

      const cartProduct = await prisma.cartProduct.findFirst({
        where: { cartItemId: cartItem.id },
      });

      if (!cartProduct) {
        return NextResponse.json(
          { message: "cart product not found" },
          { status: 404 }
        );
      }

      await prisma.cartProduct.deleteMany({
        where: { cartItemId: cartItem.id },
      });

      const newOrder = await prisma.order.create({
        data: {
          userId: session.metadata.userId,
          cartItemId: cartItem.id,
          totalAmount: session.amount_total! / 100,
          stripeSessionId: sessionId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Payment successful, order created, and coupon deactivated if used.",
          orderId: newOrder.id,
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
