import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import brandReducer from "./brand-slice/brandsSlice";
import productReducer from "./product-slice/productSlice";
import categoriesSlice from "./categories-slice/categoriesSlice";
import customerReducer from "./customer-slice/customerSlice";
import orderReducer from "./order-slice/orderSlice";


const store = configureStore({
    reducer: {
      auth: authReducer,
      brands:brandReducer,
      categories:categoriesSlice,
      products: productReducer,
      customer: customerReducer,
      order:orderReducer,

    },
  });



export default store;