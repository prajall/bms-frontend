import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface AuthState {
//   user: any;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
// };

const persistedUser = localStorage.getItem("user");
const initialState = {
  isAuthenticated: persistedUser ? true : false,
  user: persistedUser ? JSON.parse(persistedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      console.log("User set:", state.user);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      console.log("User logged out");
    },
  },
});

export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;
