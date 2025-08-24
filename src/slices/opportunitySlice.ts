import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface OpportunityState {
  opportunity: Opportunity[];
}

const initialState: OpportunityState = {
  opportunity: [],
};

export const opportunitySlice = createSlice({
  name: 'opportunity',
  initialState,
  reducers: {
    setOpportunity: (state, action: PayloadAction<Opportunity[]>) => {
      state.opportunity = action.payload;
    },
  },
});

export const { setOpportunity } = opportunitySlice.actions;
export default opportunitySlice.reducer;
