import prisma from "@/utils/db";
import { ridesClient } from "@/utils/redis";

export const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await ridesClient.get("featured_products");
    if (featuredProducts) {
      return JSON.parse(featuredProducts);
    }

    // If not in redis, fetch from DB
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
    });

    if (!products) {
      return null;
    }

    // Store in redis for future quick access
    await ridesClient.set("featured_products", JSON.stringify(products));

    return products;
  } catch (error) {
    console.log("GET_FEATURED_PRODUCTS_ERROR:", error);
    return null;
  }
};
