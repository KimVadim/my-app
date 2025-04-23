import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определяем интерфейс состояния
interface UserState {
  login: String;
}

// Начальное состояние
const initialState: UserState = {
  login: '',
};

// Создаём slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
  },
});

// Экспортируем actions и reducer
export const { setUser } = userSlice.actions;
export default userSlice.reducer;