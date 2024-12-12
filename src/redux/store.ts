import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import headerTitleReducer from "@/components/admin/Header/headerTitleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    headerTitle: headerTitleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
