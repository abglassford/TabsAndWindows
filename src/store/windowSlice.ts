import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'openWindows';

interface WindowData {
  tabIndex: number;
  content: string;
  rowData?: any;
}

export interface WindowState {
  openWindows: {
    [key: number]: WindowData;
  };
}

const loadInitialState = (): WindowState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { openWindows: JSON.parse(stored) } : { openWindows: {} };
};

const initialState: WindowState = loadInitialState();

const windowSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    windowOpened: (state, action: PayloadAction<WindowData>) => {
      const { tabIndex, content, rowData } = action.payload;
      state.openWindows[tabIndex] = {
        tabIndex,
        content,
        rowData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.openWindows));
    },
    windowClosed: (state, action: PayloadAction<{ tabIndex: number }>) => {
      delete state.openWindows[action.payload.tabIndex];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.openWindows));
    },
    validateWindows: (state) => {
      const validWindows = { ...state.openWindows };
      Object.keys(validWindows).forEach(tabIndex => {
        const windowRef = window.open('', `Tab${tabIndex}`);
        if (!windowRef || windowRef.closed) {
          delete validWindows[Number(tabIndex)];
        } else {
          windowRef.focus();
        }
      });
      state.openWindows = validWindows;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.openWindows));
    }
  }
});

export const { windowOpened, windowClosed, validateWindows } = windowSlice.actions;
export default windowSlice.reducer;