export interface ProductsInCart {
  quantity: number;
  cartId: string | undefined;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
}

export interface RecommendationProducts {
  name: string;
  id: string;
  description: string;
  price: number;
  image: string;
}
