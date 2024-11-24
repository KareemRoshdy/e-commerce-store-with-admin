import { NextResponse } from "next/server";
import prisma from "@/utils/db";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/products/recommendations
 * @desc    Get All recommendations Products
 * @access  public
 ================================================================================================================================
*/
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
