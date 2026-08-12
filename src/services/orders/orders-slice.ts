import { createSlice } from '@reduxjs/toolkit';

import { fetchOrderByNumber } from './orders-thunks';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TOrdersFeedState = {
  error: string;
  isConnected: boolean;
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TOrdersState = {
  currentOrder: TOrder | null;
  currentOrderError: string;
  currentOrderIsLoading: boolean;
  feed: TOrdersFeedState;
  profile: TOrdersFeedState;
};

const initialFeedState: TOrdersFeedState = {
  error: '',
  isConnected: false,
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
};

export const initialState: TOrdersState = {
  currentOrder: null,
  currentOrderError: '',
  currentOrderIsLoading: false,
  feed: { ...initialFeedState },
  profile: { ...initialFeedState },
};

const setOrders = (state: TOrdersFeedState, payload: TOrdersResponse): void => {
  state.error = '';
  state.isLoading = false;
  state.orders = payload.orders;
  state.total = payload.total;
  state.totalToday = payload.totalToday;
};

const setConnectionPending = (state: TOrdersFeedState): void => {
  state.error = '';
  state.isLoading = true;
};

const setConnectionOpen = (state: TOrdersFeedState): void => {
  state.error = '';
  state.isConnected = true;
  state.isLoading = false;
};

const setConnectionError = (state: TOrdersFeedState, error: string): void => {
  state.error = error;
  state.isLoading = false;
};

const setConnectionClosed = (state: TOrdersFeedState): void => {
  state.isConnected = false;
  state.isLoading = false;
};

const resetFeed = (state: TOrdersFeedState): void => {
  state.error = '';
  state.isConnected = false;
  state.isLoading = false;
  state.orders = [];
  state.total = 0;
  state.totalToday = 0;
};

export const ordersSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder = null;
        state.currentOrderError = '';
        state.currentOrderIsLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.currentOrderIsLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.currentOrderError = 'Не удалось загрузить заказ.';
        state.currentOrderIsLoading = false;
      });
  },
  initialState,
  name: 'orders',
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderError = '';
      state.currentOrderIsLoading = false;
    },
    feedConnect: (state, _action: PayloadAction<string>) => {
      setConnectionPending(state.feed);
    },
    feedDisconnect: (state) => {
      resetFeed(state.feed);
    },
    feedOnClose: (state) => {
      setConnectionClosed(state.feed);
    },
    feedOnError: (state, action: PayloadAction<string>) => {
      setConnectionError(state.feed, action.payload);
    },
    feedOnMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      setOrders(state.feed, action.payload);
    },
    feedOnOpen: (state) => {
      setConnectionOpen(state.feed);
    },
    profileOrdersConnect: (state, _action: PayloadAction<string>) => {
      setConnectionPending(state.profile);
    },
    profileOrdersDisconnect: (state) => {
      resetFeed(state.profile);
    },
    profileOrdersOnClose: (state) => {
      setConnectionClosed(state.profile);
    },
    profileOrdersOnError: (state, action: PayloadAction<string>) => {
      setConnectionError(state.profile, action.payload);
    },
    profileOrdersOnMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      setOrders(state.profile, action.payload);
    },
    profileOrdersOnOpen: (state) => {
      setConnectionOpen(state.profile);
    },
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectCurrentOrderError: (state) => state.currentOrderError,
    selectCurrentOrderIsLoading: (state) => state.currentOrderIsLoading,
    selectFeedError: (state) => state.feed.error,
    selectFeedIsConnected: (state) => state.feed.isConnected,
    selectFeedIsLoading: (state) => state.feed.isLoading,
    selectFeedOrders: (state) => state.feed.orders,
    selectFeedTotal: (state) => state.feed.total,
    selectFeedTotalToday: (state) => state.feed.totalToday,
    selectProfileOrders: (state) => state.profile.orders,
    selectProfileOrdersError: (state) => state.profile.error,
    selectProfileOrdersIsConnected: (state) => state.profile.isConnected,
    selectProfileOrdersIsLoading: (state) => state.profile.isLoading,
  },
});

export const {
  clearCurrentOrder,
  feedConnect,
  feedDisconnect,
  feedOnClose,
  feedOnError,
  feedOnMessage,
  feedOnOpen,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} = ordersSlice.actions;

export const {
  selectCurrentOrder,
  selectCurrentOrderError,
  selectCurrentOrderIsLoading,
  selectFeedError,
  selectFeedIsConnected,
  selectFeedIsLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersIsConnected,
  selectProfileOrdersIsLoading,
} = ordersSlice.selectors;
