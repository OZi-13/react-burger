import { createSlice } from '@reduxjs/toolkit';

import { createOrderThunk } from './order-thunks';

type TOrderState = {
  error: string;
  isLoading: boolean;
  number: number | null;
};

const initialState: TOrderState = {
  error: '',
  isLoading: false,
  number: null,
};

export const orderSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.error = '';
        state.isLoading = true;
        state.number = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state) => {
        state.error = 'Не удалось оформить заказ. Попробуйте ещё раз.';
        state.isLoading = false;
      });
  },
  initialState,
  name: 'order',
  reducers: {
    clearOrder: (state) => {
      state.error = '';
      state.isLoading = false;
      state.number = null;
    },
  },
  selectors: {
    selectOrderError: (state) => state.error,
    selectOrderIsLoading: (state) => state.isLoading,
    selectOrderNumber: (state) => state.number,
  },
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderError, selectOrderIsLoading, selectOrderNumber } =
  orderSlice.selectors;
