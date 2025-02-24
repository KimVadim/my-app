import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Quote {
  id: string;
  opportunityId: string
  contactId: string;
  apartNum: string;
  productId: string;
  source: string;
  amount: number;
  payDate: string;
}

// Определяем интерфейс состояния
interface quoteState {
  quote: Quote[]
}

// Начальное состояние
const initialState: quoteState = {
  quote: [],
};

// Создаём slice
export const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    setQuote: (state, action: PayloadAction<Quote[]>) => {
      state.quote = action.payload;
    },
  },
});

// Экспортируем actions и reducer
export const { setQuote } = quoteSlice.actions;
export default quoteSlice.reducer;