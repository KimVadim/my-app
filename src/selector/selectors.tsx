import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; // путь к твоему стору

export const selectFilteredQuotes = createSelector(
  [(state: RootState) => state.quote.quote, (_, optyId: string) => optyId],
  (quotes, optyId) => quotes.filter((quote) => quote["Opportunity"] === optyId)
  .sort((a, b) =>  new Date(b["Date/Time"]).getTime() - new Date(a["Date/Time"]).getTime())
);