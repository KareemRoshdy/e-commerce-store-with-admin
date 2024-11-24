import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/products/category/:categoryName
 * @desc    Get All Products By Category Name
 * @access  public
 ================================================================================================================================
*/
interface Props {
  params: Promise<{
    categoryName: string;
  }>;
}
export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { categoryName } = await params;

    const products = await prisma.product.findMany({
      where: {
        category: categoryName,
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
