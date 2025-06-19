import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch brands
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async () => {
    const response = await axios.get("https://avien-clothing-admin.onrender.com/api/brands");
    return response.data;
  }
);

// Async thunk to fetch recent brands
export const fetchRecentBrands = createAsyncThunk(
  "brands/fetchRecentBrands",
  async () => {
    const response = await axios.get("https://avien-clothing-admin.onrender.com/api/brands");
    return response.data.slice(-3).reverse(); // Reverse to get the latest at the top
  }
);

// Async thunk to delete a brand
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id) => {
    await axios.delete(`https://avien-clothing-admin.onrender.com/api/brands/${id}`);
    return id; // Return the id for removing from the state
  }
);

// Async thunk to update a brand
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, updatedData }) => {
    const response = await axios.put(`https://avien-clothing-admin.onrender.com/api/brands/${id}`, updatedData);
    return response.data;
  }
);

// Async thunk to add a new brand
export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async (newBrand) => {
    const response = await axios.post("https://avien-clothing-admin.onrender.com/api/brands", newBrand);
    return response.data; // Return the added brand data
  }
);

// Async thunk to toggle the active status of a brand
export const toggleBrandActive = createAsyncThunk(
  "brands/toggleBrandActive",
  async (id) => {
    const response = await axios.put(`https://avien-clothing-admin.onrender.com/api/brands/${id}/toggleActive`);
    return response.data;
  }
);

// Slice definition
const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    recentBrands: [], // New state property for recent brands
    loading: false,
    error: null,
  },
  reducers: {
    // Other custom reducers can be added here if necessary
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Recent Brands
      .addCase(fetchRecentBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBrands = action.payload;
      })
      .addCase(fetchRecentBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((brand) => brand._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((brand) => brand._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Brand
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload); // Add the new brand to the state
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Toggle Brand Active Status
      .addCase(toggleBrandActive.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleBrandActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((brand) => brand._id === action.payload._id);
        if (index !== -1) {
          state.brands[index].active = action.payload.active;
        }
      })
      .addCase(toggleBrandActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default brandsSlice.reducer;
