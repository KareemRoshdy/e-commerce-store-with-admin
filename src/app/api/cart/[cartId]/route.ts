import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 ================================================================================================================================
 * @method  PUT
 * @route   ~/api/cart/:cartId
 * @desc    Update Product Quantity in cart by cart ID
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/
interface Props {
  params: Promise<{
    cartId: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { cartId } = await params;

    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartId, userId: userPayload.userId },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    const productExists = cartItem.cartProducts.some(
      (cartProduct) => cartProduct.productId === productId
    );

    if (!productExists) {
      return NextResponse.json(
        { message: "Product not found in cart item" },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      await prisma.cartProduct.deleteMany({
        where: { cartItemId: cartItem.id, productId },
      });

      const remainingProducts = await prisma.cartProduct.count({
        where: { cartItemId: cartItem.id },
      });

      if (remainingProducts === 0) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }
    } else {
      await prisma.cartProduct.updateMany({
        where: { cartItemId: cartItem.id, productId },
        data: { quantity },
      });
    }

    const updatedCartItem = await prisma.cartItem.findFirst({
      where: { id: cartItem.id },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
