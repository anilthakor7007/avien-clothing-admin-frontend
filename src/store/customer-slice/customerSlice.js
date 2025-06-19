// src/redux/customerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  customers: [],
  loading: false,
  error: null,
  token: null,
  currentCustomer: null,
};

// Async thunk to fetch all customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async () => {
    const response = await axios.get('https://avien-clothing-admin.onrender.com/api/customers');
    return response.data;
  }
);

// Async thunk to register a new customer
export const registerCustomer = createAsyncThunk(
  'customer/registerCustomer',
  async (customerData, { dispatch }) => {
    const response = await axios.post('https://avien-clothing-admin.onrender.com/api/customers', customerData);
    dispatch(addCustomer(response.data)); // Dispatch the addCustomer action
    return response.data;
  }
);

// Async thunk to fetch a customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (customerId) => {
    const response = await axios.get(`https://avien-clothing-admin.onrender.com/api/customers/${customerId}`);
    return response.data;
  }
);

// Async thunk to edit a customer by ID
export const editCustomerById = createAsyncThunk(
  'customer/editCustomerById',
  async ({ customerId, customerData }) => {
    const response = await axios.put(`https://avien-clothing-admin.onrender.com/api/customers/${customerId}`, customerData);
    return response.data;
  }
);

// Async thunk to delete a customer by ID
export const deleteCustomerById = createAsyncThunk(
  'customer/deleteCustomerById',
  async (customerId) => {
    await axios.delete(`https://avien-clothing-admin.onrender.com/api/customers/${customerId}`);
    return customerId; // Return the ID to remove from the state
  }
);

// Async thunk for customer login
export const loginCustomer = createAsyncThunk(
  'customer/loginCustomer',
  async (credentials, { dispatch }) => {
    const response = await axios.post('https://avien-clothing-admin.onrender.com/api/customers/login', credentials);
    
    // Store the token and customer data in local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentCustomer', JSON.stringify(response.data.customer));
    
    return response.data; // Return the entire response for further processing
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.currentCustomer = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentCustomer');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        // No need to push here since we're already handling it in the thunk
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        const existingCustomer = state.customers.find(customer => customer.id === action.payload.id);
        if (existingCustomer) {
          Object.assign(existingCustomer, action.payload);
        } else {
          state.customers.push(action.payload);
        }
      })
      .addCase(editCustomerById.fulfilled, (state, action) => {
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(deleteCustomerById.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.currentCustomer = action.payload.customer;
      });
  },
});

// Export actions
export const { setCustomers, addCustomer, logout } = customerSlice.actions;

// Export the reducer
export default customerSlice.reducer;
