import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';  // Correct import


// Async thunk for signup
export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('https://avien-clothing-admin.onrender.com/api/user/signup', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Signup failed');
    }
});

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('https://avien-clothing-admin.onrender.com/api/user/login', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    role: null,
    isLoading: false,
    error: null,
};

// Decode token from localStorage (if it exists) to set initial role
if (initialState.token) {
    try {
        const decodedToken = jwtDecode(initialState.token);
        initialState.role = decodedToken.role;
    } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        initialState.token = null;
        initialState.role = null;
    }
}

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('role'); // Clear role from local storage
            state.user = null;
            state.token = null;
            state.role = null;
        },
    },
    extraReducers: (builder) => {
        // Signup reducers
        builder.addCase(signupUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(signupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;

            try {
                const decoded = jwtDecode(action.payload.token);
                state.role = decoded.role;
            } catch (error) {
                console.error("Failed to decode token:", error);
                state.role = null;
            }

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', state.role); 
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Signup failed';
        });

        // Login reducers
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;

            try {
                const decoded = jwtDecode(action.payload.token);
                state.role = decoded.role;
            } catch (error) {
                console.error("Failed to decode token:", error);
                state.role = null;
            }

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', state.role); 
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Login failed';
        });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
