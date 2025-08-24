import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  login: String;
}

const initialState: UserState = {
  login: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
