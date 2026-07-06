import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let debounceTimer = null;

export const uploadCart = createAsyncThunk(
  "cart/updateCart",
  async ({ getToken }, thunkAPI) => {
    try {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const result = await new Promise((resolve, reject) => {
        debounceTimer = setTimeout(async () => {
          try {
            const { cartItems } = thunkAPI.getState().cart;
            const token = await getToken();
            const { data } = await axios.post(
              "/api/cart",
              { cart: cartItems },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            resolve(data);
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update cart");
    }
  },
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ getToken }, thunkAPI) => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    total: 0,
    cartItems: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]++;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]--;
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId];
        }
      }
      state.total -= 1;
    },
    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId]
        ? state.cartItems[productId]
        : 0;
      delete state.cartItems[productId];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cart;
      state.total = Object.values(action.payload.cart).reduce(
        (acc, item) => acc + item,
        0,
      );
    });
  },
});

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
