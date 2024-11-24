import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { ridesClient } from "@/utils/redis";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/products/featured
 * @desc    Get All Featured Products
 * @access  public
 ================================================================================================================================
*/
export async function GET() {
  try {
    const featuredProducts = await ridesClient.get("featured_products");
    if (featuredProducts) {
      return NextResponse.json(JSON.parse(featuredProducts), { status: 200 });
    }

    // If not in redis, fetch from DB
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
    });

    if (!products) {
      return NextResponse.json(
        { message: "No featured products found" },
        { status: 404 }
      );
    }

    // Store in redis for future quick access
    await ridesClient.set("featured_products", JSON.stringify(products));

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
