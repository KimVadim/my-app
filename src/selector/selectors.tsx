import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; // путь к твоему стору

export const selectFilteredQuotes = createSelector(
  [(state: RootState) => state.quote.quote, (_, optyId: string) => optyId],
  (quotes, optyId) => quotes.filter((quote) => quote[1] === optyId)
  .sort((a, b) =>  new Date(b[7]).getTime() - new Date(a[7]).getTime())
);