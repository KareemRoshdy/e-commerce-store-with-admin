import prisma from "@/utils/db";
import CategoryPage from "../_components/CategoryPage";
import { cookies } from "next/headers";
import { verifyTokenForPages } from "@/utils/verifyToken";

interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const Category = async ({ params }: CategoryPageProps) => {
  const token = (await cookies()).get("accessToken")?.value as string;

  const user = await verifyTokenForPages(token);

  const { categoryName } = await params;

  if (!categoryName) return <div>Not found</div>;

  const products = await prisma.product.findMany({
    where: {
      category: categoryName,
    },
  });

  return (
    <CategoryPage
      products={products}
      categoryName={categoryName}
      user={user!}
    />
  );
};

export default Category;
