import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Expense {
    id: string;
    contactId: string;
    company: string;
    type: string;
    date: string;
    author: string;
    sum: number;
    comment: string;
    apartNum: number;
    paymentType: string;
    invoice: string;
    processed: string;
}

interface ExpenseState {
    expense: Expense[]
};

const initialState: ExpenseState = {
    expense: []
};

export const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        setExpense: (state, action: PayloadAction<Expense[]>) => {
            state.expense = action.payload;
        }
    }
});

export const { setExpense } = expenseSlice.actions;
export default expenseSlice.reducer;