import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder } from '@utils/api';

export const createOrderThunk = createAsyncThunk('order/createOrder', createOrder);
