import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import headerTitleReducer from "@/components/admin/Header/headerTitleSlice";
import configReducer from "../redux/slices/configSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    headerTitle: headerTitleReducer,
    config: configReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
