import { verifyTokenForPages } from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import { getCartItems } from "@/actions/get-cart-items";
import { cookies } from "next/headers";

import Cart from "./_components/Cart";
import prisma from "@/utils/db";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cart",
  description: "E-Commerce Store by create next app",
};

const CartPage = async () => {
  const token = (await cookies()).get("accessToken")?.value as string;

  const user = await verifyTokenForPages(token);

  if (!user) redirect("/");

  const cart = (await getCartItems(user.id)) ?? [];

  const recommendations = await prisma.product.findMany({
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

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <Cart cart={cart} recommendations={recommendations} user={user} />
      </div>
    </div>
  );
};

export default CartPage;
