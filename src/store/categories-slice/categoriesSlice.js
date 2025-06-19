import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL for categories
const apiUrl = 'https://avien-clothing-admin.onrender.com/api/categories';

// Fetch categories from the backend
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new category with associated brands
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await axios.post(apiUrl, newCategory);
      return response.data;  // Ensure the response data contains the new category
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a category with associated brands
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedData);
      return response.data;  // Ensure the response data contains the updated category
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Toggle category active status
export const toggleCategoryActive = createAsyncThunk(
  'categories/toggleCategoryActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}/toggleActive`);
      return response.data; // Ensure the backend sends the updated category with new active status
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to toggle category active status');
    }
  }
);
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the specific category in the state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle active status
      .addCase(toggleCategoryActive.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index].active = action.payload.active; // Update the active status
        }
      })
      .addCase(toggleCategoryActive.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
