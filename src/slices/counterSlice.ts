import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определяем интерфейс состояния
interface CounterState {
  value: number;
}

// Начальное состояние
const initialState: CounterState = {
  value: 0,
};

// Создаём slice
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Экспортируем actions и reducer
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;