import { order } from '@utils/test-fixtures';

import {
  clearCurrentOrder,
  feedConnect,
  feedDisconnect,
  feedOnClose,
  feedOnError,
  feedOnMessage,
  feedOnOpen,
  initialState,
  ordersSlice,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} from './orders-slice';
import { fetchOrderByNumber } from './orders-thunks';

const ordersResponse = {
  orders: [order],
  success: true,
  total: 100,
  totalToday: 10,
};

describe('ordersSlice', () => {
  it('returns the initial state', () => {
    const result = ordersSlice.reducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });

  it('clears current order state', () => {
    const result = ordersSlice.reducer(
      {
        ...initialState,
        currentOrder: order,
        currentOrderError: 'Error',
        currentOrderIsLoading: true,
      },
      clearCurrentOrder()
    );

    expect(result.currentOrder).toBeNull();
    expect(result.currentOrderError).toBe('');
    expect(result.currentOrderIsLoading).toBe(false);
  });

  it('handles feed connection lifecycle', () => {
    const pendingResult = ordersSlice.reducer(undefined, feedConnect('wss://feed'));
    const openResult = ordersSlice.reducer(pendingResult, feedOnOpen());
    const errorResult = ordersSlice.reducer(openResult, feedOnError('Connection error'));
    const closeResult = ordersSlice.reducer(openResult, feedOnClose());
    const disconnectResult = ordersSlice.reducer(
      {
        ...openResult,
        feed: {
          ...openResult.feed,
          orders: [order],
          total: 100,
          totalToday: 10,
        },
      },
      feedDisconnect()
    );

    expect(pendingResult.feed).toMatchObject({
      error: '',
      isLoading: true,
    });
    expect(openResult.feed).toMatchObject({
      error: '',
      isConnected: true,
      isLoading: false,
    });
    expect(errorResult.feed).toMatchObject({
      error: 'Connection error',
      isLoading: false,
    });
    expect(closeResult.feed).toMatchObject({
      isConnected: false,
      isLoading: false,
    });
    expect(disconnectResult.feed).toEqual(initialState.feed);
  });

  it('stores feed orders from websocket message', () => {
    const result = ordersSlice.reducer(undefined, feedOnMessage(ordersResponse));

    expect(result.feed).toEqual({
      error: '',
      isConnected: false,
      isLoading: false,
      orders: [order],
      total: 100,
      totalToday: 10,
    });
  });

  it('handles profile orders connection lifecycle', () => {
    const pendingResult = ordersSlice.reducer(
      undefined,
      profileOrdersConnect('wss://profile')
    );
    const openResult = ordersSlice.reducer(pendingResult, profileOrdersOnOpen());
    const errorResult = ordersSlice.reducer(
      openResult,
      profileOrdersOnError('Profile connection error')
    );
    const closeResult = ordersSlice.reducer(openResult, profileOrdersOnClose());
    const disconnectResult = ordersSlice.reducer(
      {
        ...openResult,
        profile: {
          ...openResult.profile,
          orders: [order],
          total: 100,
          totalToday: 10,
        },
      },
      profileOrdersDisconnect()
    );

    expect(pendingResult.profile).toMatchObject({
      error: '',
      isLoading: true,
    });
    expect(openResult.profile).toMatchObject({
      error: '',
      isConnected: true,
      isLoading: false,
    });
    expect(errorResult.profile).toMatchObject({
      error: 'Profile connection error',
      isLoading: false,
    });
    expect(closeResult.profile).toMatchObject({
      isConnected: false,
      isLoading: false,
    });
    expect(disconnectResult.profile).toEqual(initialState.profile);
  });

  it('stores profile orders from websocket message', () => {
    const result = ordersSlice.reducer(
      undefined,
      profileOrdersOnMessage(ordersResponse)
    );

    expect(result.profile).toEqual({
      error: '',
      isConnected: false,
      isLoading: false,
      orders: [order],
      total: 100,
      totalToday: 10,
    });
  });

  it('sets loading state while current order is requested', () => {
    const result = ordersSlice.reducer(
      {
        ...initialState,
        currentOrder: order,
        currentOrderError: 'Error',
      },
      fetchOrderByNumber.pending('request-id', String(order.number))
    );

    expect(result.currentOrder).toBeNull();
    expect(result.currentOrderError).toBe('');
    expect(result.currentOrderIsLoading).toBe(true);
  });

  it('stores current order after successful request', () => {
    const result = ordersSlice.reducer(
      {
        ...initialState,
        currentOrderIsLoading: true,
      },
      fetchOrderByNumber.fulfilled(order, 'request-id', String(order.number))
    );

    expect(result.currentOrder).toEqual(order);
    expect(result.currentOrderIsLoading).toBe(false);
  });

  it('stores an error after failed current order request', () => {
    const result = ordersSlice.reducer(
      {
        ...initialState,
        currentOrderIsLoading: true,
      },
      fetchOrderByNumber.rejected(
        new Error('Network error'),
        'request-id',
        String(order.number)
      )
    );

    expect(result.currentOrderError).toBe('Не удалось загрузить заказ.');
    expect(result.currentOrderIsLoading).toBe(false);
  });
});
