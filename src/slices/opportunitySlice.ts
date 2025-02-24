import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Opportunity {
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

// Определяем интерфейс состояния
interface OpportunityState {
  opportunity: Opportunity[];
}

// Начальное состояние
const initialState: OpportunityState = {
  opportunity: [],
};

// Создаём slice
export const opportunitySlice = createSlice({
  name: "opportunity",
  initialState,
  reducers: {
    setOpportunity: (state, action: PayloadAction<Opportunity[]>) => {
      state.opportunity = action.payload;
    },
  },
});

// Экспортируем actions и reducer
export const { setOpportunity } = opportunitySlice.actions;
export default opportunitySlice.reducer;