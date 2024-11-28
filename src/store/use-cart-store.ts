import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Coupon } from "@prisma/client";
import { Product } from "./use-product-store";

interface UserCartProps {
  cart: Product[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  loading: boolean;
  isCouponApplied: boolean;
  getCartItems: () => void;
  addToCart: (productId: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (cartId: string, productId: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
  getMyCoupon: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<UserCartProps>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: false,

  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons");

      set({ coupon: res.data.coupon });
    } catch (error) {
      console.log("Error fetching coupon:", error);
    }
  },

  applyCoupon: async (code: string) => {
    set({ loading: true });
    try {
      const res = await axios.post("/coupons/validate", { code });

      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      set({ loading: false });
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    set({ loading: true });

    try {
      const res = await axios.get("/cart");

      set({ cart: res.data });
      get().calculateTotals();
    } catch {
      set({ cart: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product: Product) => {
    set({ loading: true });

    try {
      await axios.post("/cart", { productId: product.id });

      toast.success("Product added to cart", { id: "addToCart" });

      set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        const newCart = existingItem
          ? state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity! + 1 }
                : item
            )
          : [...state.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
    } catch {
      toast.error("An error occurred ,Login first");
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true });
    try {
      await axios.delete("/cart", { data: { productId } });

      set((prevState) => ({
        cart: prevState.cart.filter((item) => item.id !== productId),
      }));

      toast.success("Product removed from cart");
      get().calculateTotals();
    } catch {
      toast.error("Error, try again");
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (
    cartId: string,
    productId: string,
    quantity: number
  ) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`/cart/${cartId}`, { productId, quantity });

      set((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      }));

      get().calculateTotals();
    } catch {
      toast.error("Error updating quantity");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity!,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
}));
