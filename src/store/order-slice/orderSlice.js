import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  const response = await axios.get('https://avien-clothing-admin.onrender.com/api/orders');
  return response.data;
});

// Async thunk for creating a new order
export const createOrder = createAsyncThunk('order/createOrder', async (orderData) => {
  const response = await axios.post('https://avien-clothing-admin.onrender.com/api/orders', orderData);
  return response.data;
});

// Async thunk for updating an order's status
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      // Make an API call to update the orderStatus on the server
      const response = await axios.put(
        `https://avien-clothing-admin.onrender.com/api/orders/${orderId}`,  // URL with only orderId
        {
          orderStatus: orderStatus,  // The updated status sent in the request body
        }
      );

      if (response.status === 200) {
        return response.data;  // Assuming response.data contains the updated order
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// delete order slice 
export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
  await axios.delete(`https://avien-clothing-admin.onrender.com/api/orders/${orderId}`);
  return orderId;
});


const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload; // Stores the fetched orders
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Create Order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload); // Add newly created order to the list
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        // Update only the orderStatus field for the specific order
        const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], orderStatus: updatedOrder.orderStatus };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        // Handle error if needed
        console.error(action.payload);
      });
  },
});

export default orderSlice.reducer;

