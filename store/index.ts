import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import windowReducer from './windowSlice';

export interface RootState {
  forms: {
    tabs: Array<{
      content: string;
    }>;
  };
  windows: {
    openWindows: {
      [key: number]: boolean;
    };
  };
}

export const store = configureStore({
  reducer: {
    forms: formReducer,
    windows: windowReducer
  }
});