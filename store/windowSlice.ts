import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WindowState {
  openWindows: {
    [key: number]: boolean;
  }
}

const initialState: WindowState = {
  openWindows: {}
};

const windowSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    windowOpened: (state, action: PayloadAction<number>) => {
      state.openWindows[action.payload] = true;
    },
    windowClosed: (state, action: PayloadAction<number>) => {
      delete state.openWindows[action.payload];
    }
  }
});

export const { windowOpened, windowClosed } = windowSlice.actions;
export default windowSlice.reducer;