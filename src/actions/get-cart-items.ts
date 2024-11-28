import prisma from "@/utils/db";

export const getCartItems = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        cartItem: {
          include: {
            cartProducts: {
              include: {
                product: true,
              },
              orderBy: {
                createdAt: "asc", // أو "desc" حسب الترتيب المطلوب
              },
            },
          },
        },
      },
    });

    if (!user || !user.cartItem) {
      return null;
    }

    const productsInCart = user.cartItem.cartProducts
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((cartProduct) => ({
        ...cartProduct.product,
        quantity: cartProduct.quantity,
        cartId: user.cartItem?.id,
      }));

    return productsInCart;
  } catch (error) {
    console.log("GET_CART_ITEMS_ERROR:", error);
    return null;
  }
};
