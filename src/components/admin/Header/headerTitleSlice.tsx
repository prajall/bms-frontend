import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  title: "Dashboard",
};

const headerTitleSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setHeaderTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setHeaderTitle } = headerTitleSlice.actions;
export default headerTitleSlice.reducer;
