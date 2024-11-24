import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

import { isAdmin, verifyToken } from "@/utils/verifyToken";
import cloudinary from "@/utils/cloudinary";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/admin/products
 * @desc    Get All Products
 * @access  private [Only Admin]
 ================================================================================================================================
*/
export async function GET(req: NextRequest) {
  try {
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

    const products = await prisma.product.findMany();

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/admin/products
 * @desc    Crete new Products
 * @access  private [Only Admin]
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
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

    const { name, description, price, image, category } = await req.json();
    let cloudinaryResponse = null;

    if (image) {
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      } catch {
        const errorMessage = "Image upload failed";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url || "",
        category,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
