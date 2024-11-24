import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export type Product = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image: string;
  isFeatured?: boolean;
  quantity?: number;
  cartId?: string;
};

interface ProductState {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;

  createProduct: (product: Product) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  setProducts: (products: Product[]) => set({ products }),

  createProduct: async (product: Product) => {
    set({ loading: true });

    try {
      const response = await axios.post("/admin/products", product);

      toast.success("Product created successfully!");
      set((state) => ({
        products: [...state.products, response.data],
        loading: false,
      }));
    } catch (error) {
      toast.error("not created");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });

    try {
      const res = await axios.get("/admin/products");

      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error("Failed to fetch product.");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ loading: true });

    try {
      const res = await axios.get(`/products/category/${category}`);

      set({ products: res.data.products, loading: false });
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      set({ loading: false });
    }
  },

  removeProduct: async (productId: string) => {
    set({ loading: true });

    try {
      await axios.delete(`/admin/products/${productId}`);
      toast.success("product deleted.");
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product.id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error("Failed to remove product.\n");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId: string) => {
    set({ loading: true });

    try {
      const res = await axios.patch(`/admin/products/${productId}/featured`);
      const updatedProduct = res.data.product;

      set((prevState) => ({
        products: prevState.products.map((product) =>
          product.id === productId
            ? { ...product, isFeatured: updatedProduct.isFeatured }
            : product
        ),
        loading: false,
      }));

      toast.success("Done.");
    } catch (error) {
      toast.error("Failed to featured product.");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");

      set({ products: res.data });
    } catch (error) {
      console.log("Error to fetch featured products:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
