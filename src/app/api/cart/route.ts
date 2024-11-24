import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/cart
 * @desc    GET All Product from cart
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/
export async function GET(req: NextRequest) {
  try {
    // Verify the user token
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.userId,
      },
      include: {
        cartItem: {
          include: {
            cartProducts: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.cartItem) {
      return NextResponse.json(
        { message: "No cart items found" },
        { status: 404 }
      );
    }

    const productsInCart = user.cartItem.cartProducts.map((cartProduct) => ({
      ...cartProduct.product,
      quantity: cartProduct.quantity,
      cartId: user.cartItem?.id,
    }));

    return NextResponse.json(productsInCart, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/cart
 * @desc    Add Product to cart
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();

    const cartItem = await prisma.cartItem.findUnique({
      where: { userId: userPayload.userId },
    });

    if (!cartItem) {
      // إنشاء عربة تسوق جديدة وإضافة المنتج
      const newCartItem = await prisma.cartItem.create({
        data: {
          user: { connect: { id: userPayload.userId } },
          cartProducts: {
            create: {
              product: { connect: { id: productId } },
              quantity: quantity || 1,
            },
          },
        },
      });

      return NextResponse.json(newCartItem, { status: 201 });
    }

    // تحقق إذا كان المنتج موجودًا بالفعل
    const existingCartProduct = await prisma.cartProduct.findFirst({
      where: { cartItemId: cartItem.id, productId },
    });

    if (existingCartProduct) {
      // إذا كان موجودًا، قم بتحديث الكمية
      await prisma.cartProduct.update({
        where: { id: existingCartProduct.id },
        data: { quantity: existingCartProduct.quantity + (quantity || 1) },
      });
    } else {
      // إذا لم يكن موجودًا، قم بإضافته إلى عربة التسوق
      await prisma.cartProduct.create({
        data: {
          cartItem: { connect: { id: cartItem.id } },
          product: { connect: { id: productId } },
          quantity: quantity || 1,
        },
      });
    }

    // استرجاع عربة التسوق المحدثة
    const updatedCart = await prisma.cartItem.findUnique({
      where: { id: cartItem.id },
      include: {
        cartProducts: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/**
 ================================================================================================================================
 * @method  DELETE
 * @route   ~/api/cart
 * @desc    Delete All Product from cart
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/
export async function DELETE(req: NextRequest) {
  try {
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    // جلب العنصر الخاص بالمستخدم
    const cartItem = await prisma.cartItem.findFirst({
      where: { userId: userPayload.userId },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // حذف المنتج من السلة
    const cartProduct = await prisma.cartProduct.findFirst({
      where: { cartItemId: cartItem.id, productId },
    });

    if (!cartProduct) {
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );
    }

    // حذف المنتج بالكامل
    await prisma.cartProduct.delete({ where: { id: cartProduct.id } });

    // إذا أصبحت عربة التسوق فارغة، احذفها
    const remainingProducts = await prisma.cartProduct.findMany({
      where: { cartItemId: cartItem.id },
    });

    if (remainingProducts.length === 0) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
    }

    return NextResponse.json(
      { message: "Product removed from cart successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
