import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    mobileOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileOpen: (state, action) => {
      state.mobileOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setMobileOpen } = uiSlice.actions;
export default uiSlice.reducer;