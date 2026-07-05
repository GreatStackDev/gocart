import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (storeId) => {
    try {
      const { data } = await axios.get(
        `/api/products${storeId ? `?storeId=${storeId}` : ""}`,
      );
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to fetch products",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    error: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload;
    },
    clearProduct: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
      state.error = null;
    });
    
  },
});

export const { setProduct, clearProduct } = productSlice.actions;

export default productSlice.reducer;
