import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'forms',
  initialState: {
    tabs: Array(5).fill({ content: '' })
  },
  reducers: {
    updateForm: (state, action) => {
      const { tabIndex, content } = action.payload;
      state.tabs[tabIndex].content = content;
    }
  }
});

export const { updateForm } = formSlice.actions;
export default formSlice.reducer;