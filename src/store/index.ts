import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import windowReducer, { WindowState } from './windowSlice';

export interface RootState {
  forms: {
    tabs: Array<{
      content: string;
    }>;
  };
  windows: WindowState;
}

export const store = configureStore({
  reducer: {
    forms: formReducer,
    windows: windowReducer
  }
});