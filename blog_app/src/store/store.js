// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import crudReducer from "./CRUD";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crud:crudReducer,
  },
});
