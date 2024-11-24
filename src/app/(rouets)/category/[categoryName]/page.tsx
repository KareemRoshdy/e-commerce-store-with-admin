import CategoryPage from "../_components/CategoryPage";

interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const Category = async ({ params }: CategoryPageProps) => {
  const { categoryName } = await params;

  if (!categoryName) return <div>Not found</div>;

  return <CategoryPage categoryName={categoryName} />;
};

export default Category;
