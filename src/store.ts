import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts"; // Подключаем наш reducer
import opportunityReducer from "./slices/opportunitySlice.ts";
import quoteReducer from "./slices/quoteSlice.ts";
import contactReducer from "./slices/contactSlice.ts";
import monthPaymentReducer from "./slices/monthPaymentsSlice.ts";
import expenseReducer from "./slices/expenseSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    opportunity: opportunityReducer,
    quote: quoteReducer,
    contact: contactReducer,
    monthPayment: monthPaymentReducer,
    expense: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;