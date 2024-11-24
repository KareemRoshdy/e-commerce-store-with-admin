import prisma from "./db";
import { ridesClient } from "./redis";

export async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
    });

    await ridesClient.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
  } catch (error) {
    console.log("Error to cache the featured products", error);
  }
}
