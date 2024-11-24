import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

import { isAdmin, verifyToken } from "@/utils/verifyToken";
import cloudinary from "@/utils/cloudinary";

/**
 ================================================================================================================================
 * @method  DELETE
 * @route   ~/api/admin/products/:productId
 * @desc    DELETE Product by ID
 * @access  private [Only Admin]
 ================================================================================================================================
*/
interface Props {
  params: {
    productId: string;
  };
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Props["params"]> }
) {
  try {
    const params = await context.params; // Await params
    const { productId } = params;

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

    if (product.image) {
      const publicId = product.image.split("/").pop()?.split(".")[0];

      try {
        await cloudinary.uploader.destroy(`product/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("error Image not deleted from cloudinary", error);
      }
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
