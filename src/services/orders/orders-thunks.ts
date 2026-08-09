import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByNumber } from '@utils/api';

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  getOrderByNumber
);
