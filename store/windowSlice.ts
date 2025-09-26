import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'openWindows';

interface WindowInfo {
  isOpen: boolean;
  content: string;
}

interface WindowState {
  openWindows: {
    [key: number]: WindowInfo;
  };
}

// Load initial state from localStorage
const loadInitialState = (): WindowState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { openWindows: JSON.parse(stored) } : { openWindows: {} };
};

interface WindowOpenedPayload {
  tabIndex: number;
  content: string;
}

const windowSlice = createSlice({
  name: 'windows',
  initialState: loadInitialState(),
  reducers: {
    windowOpened: (state, action: PayloadAction<WindowOpenedPayload>) => {
      const { tabIndex, content } = action.payload;
      state.openWindows[tabIndex] = {
        isOpen: true,
        content,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.openWindows));
    },
    windowClosed: (state, action: PayloadAction<number>) => {
      delete state.openWindows[action.payload];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.openWindows));
    },
    validateWindows: (state) => {
      const validWindows = { ...state.openWindows };
      Object.keys(validWindows).forEach((index) => {
        const numIndex = Number(index);
        const windowRef = window.open('', `Tab${numIndex}`);
        if (!windowRef || windowRef.closed) {
          delete validWindows[numIndex];
        } else {
          windowRef.focus();
        }
      });
      state.openWindows = validWindows;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validWindows));
    },
  },
});

export const { windowOpened, windowClosed, validateWindows } =
  windowSlice.actions;
export default windowSlice.reducer;