import { clearOrder, orderSlice } from './order-slice';
import { createOrderThunk } from './order-thunks';

describe('orderSlice', () => {
  it('returns the initial state', () => {
    const result = orderSlice.reducer(undefined, { type: '' });

    expect(result).toEqual({
      error: '',
      isLoading: false,
      number: null,
    });
  });

  it('sets loading state while order is requested', () => {
    const result = orderSlice.reducer(
      {
        error: 'Previous error',
        isLoading: false,
        number: 123,
      },
      createOrderThunk.pending('request-id', ['bun-id'])
    );

    expect(result).toEqual({
      error: '',
      isLoading: true,
      number: null,
    });
  });

  it('stores order number after successful request', () => {
    const result = orderSlice.reducer(
      {
        error: '',
        isLoading: true,
        number: null,
      },
      createOrderThunk.fulfilled(12345, 'request-id', ['bun-id'])
    );

    expect(result).toEqual({
      error: '',
      isLoading: false,
      number: 12345,
    });
  });

  it('stores an error after failed request', () => {
    const result = orderSlice.reducer(
      {
        error: '',
        isLoading: true,
        number: null,
      },
      createOrderThunk.rejected(new Error('Network error'), 'request-id', ['bun-id'])
    );

    expect(result).toEqual({
      error: 'Не удалось оформить заказ. Попробуйте ещё раз.',
      isLoading: false,
      number: null,
    });
  });

  it('clears order state', () => {
    const result = orderSlice.reducer(
      {
        error: 'Error',
        isLoading: true,
        number: 123,
      },
      clearOrder()
    );

    expect(result).toEqual({
      error: '',
      isLoading: false,
      number: null,
    });
  });
});
