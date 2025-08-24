import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quote {
  id: string;
  opportunityId: string;
  contactId: string;
  apartNum: string;
  productId: string;
  source: string;
  amount: number;
  payDate: string;
}

interface quoteState {
  quote: Quote[];
}

const initialState: quoteState = {
  quote: [],
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setQuote: (state, action: PayloadAction<Quote[]>) => {
      state.quote = action.payload;
    },
  },
});

export const { setQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
