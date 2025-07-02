import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState: CartProduct[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const product = action.payload;
      const existingProductIndex = state.findIndex(
        (item) =>
          item.id === product.id && item.variant.id === product.variant.id
      );
      if (existingProductIndex === -1) {
        state.push(product);
        toast.success("Product has been added to cart");
      }
    },
    increaseQuantity: (
      state,
      action: PayloadAction<{ id: number; variantId: number }>
    ) => {
      const { id, variantId } = action.payload;
      const productIndex = state.findIndex(
        (item) => item.id === id && item.variant.id === variantId
      );
      if (productIndex !== -1) {
        if (
          state[productIndex].quantity < state[productIndex].variant.quantity
        ) {
          state[productIndex].quantity += 1;
        }
      }
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{ id: number; variantId: number }>
    ) => {
      const { id, variantId } = action.payload;
      const productIndex = state.findIndex(
        (item) => item.id === id && item.variant.id === variantId
      );
      if (productIndex !== -1) {
        if (state[productIndex].quantity > 1) {
          state[productIndex].quantity -= 1;
        }
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; variantId: number }>
    ) => {
      const { id, variantId } = action.payload;
      const productIndex = state.findIndex(
        (item) => item.id === id && item.variant.id === variantId
      );
      if (productIndex !== -1) {
        state.splice(productIndex, 1);
        toast.success("Product has been removed from cart");
      }
    },

    clearCart: (state) => {
      state.length = 0;
      toast.success("Cart has been cleared");
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
