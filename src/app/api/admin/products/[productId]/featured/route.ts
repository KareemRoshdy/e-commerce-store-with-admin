import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { isAdmin, verifyToken } from "@/utils/verifyToken";
import { updateFeaturedProductsCache } from "@/utils/updateFeaturedProductsCache";

/**
 ================================================================================================================================
 * @method  PATCH
 * @route   ~/api/admin/products/:productId/featured
 * @desc    Edit Products
 * @access  private [Only Admin]
 ================================================================================================================================
*/
interface Props {
  params: {
    productId: string;
  };
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<Props["params"]> } // Make params a Promise
) {
  try {
    const params = await context.params; // Await params
    const { productId } = params; // Now you can safely access productId

    const userPayload = verifyToken(req);

    if (!userPayload) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing or invalid" },
        { status: 401 }
      );
    }

    const admin = await isAdmin(userPayload?.userId);
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isFeatured: !product.isFeatured,
      },
    });

    await updateFeaturedProductsCache();

    return NextResponse.json({ product: updatedProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
