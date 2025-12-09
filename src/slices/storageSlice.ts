import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Storage {
  id: string;
  contactId: string;
  apartNum: string;
  productId: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  contactName: string;
  phone: string;
}

interface StorageState {
  storage: Storage[];
}

const initialState: StorageState = {
  storage: [],
};

export const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    setStorage: (state, action: PayloadAction<Storage[]>) => {
      state.storage = action.payload;
    },
  },
});

export const { setStorage } = storageSlice.actions;
export default storageSlice.reducer;
