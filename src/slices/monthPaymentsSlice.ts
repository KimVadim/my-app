import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface MonthPayment {
    month: String;
    type: String;
    value: Number;
}

interface MonthPaymentState {
    monthPayments: MonthPayment[]
}

const initialState: MonthPaymentState = {
    monthPayments: []
}

export const monthPaymentsSlice = createSlice({
    name: "monthPayments",
    initialState,
    reducers: {
        setMonthPayments: (state, action: PayloadAction<MonthPayment[]>) => {
            state.monthPayments = action.payload;
        },
    },
});

export const { setMonthPayments } = monthPaymentsSlice.actions;
export default monthPaymentsSlice.reducer;