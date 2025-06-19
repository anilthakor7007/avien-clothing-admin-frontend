import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://avien-clothing-admin.onrender.com/api/products';

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Async thunk to create a new product
export const createProduct = createAsyncThunk('products/createProduct', async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
});

// Async thunk to update a product
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
});

// Async thunk to update product images
export const updateProductImages = createAsyncThunk('products/updateProductImages', async ({ id, images }) => {
  const response = await axios.put(`${API_URL}/${id}/images`, { images });
  return response.data; // Returns the updated product with new images
});

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Async thunk to toggle active status of a product
export const toggleProductActive = createAsyncThunk('products/toggleProductActive', async (id) => {
  const response = await axios.put(`${API_URL}/${id}/toggleActive`);
  return response.data; // Ensure this returns the updated product
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetError(state) {
      state.error = null; // Action to reset the error state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Add new product
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload; // Update product
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Product Images
      .addCase(updateProductImages.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(updateProductImages.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload; // Update product images
        }
      })
      .addCase(updateProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product._id !== action.payload); // Remove product
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Toggle Active Status
      .addCase(toggleProductActive.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index].active = action.payload.active; // Update active status
        }
      })
      .addCase(toggleProductActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the resetError action for use in components
export const { resetError } = productSlice.actions;

export default productSlice.reducer;
