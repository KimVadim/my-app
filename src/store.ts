import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice.ts"; // Подключаем наш reducer
import opportunityReducer from "./slices/opportunitySlice.ts";
import quoteReducer from "./slices/quoteSlice.ts";

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Добавляем редьюсер
    opportunity: opportunityReducer,
    quote: quoteReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;