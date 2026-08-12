import { bunIngredient, mainIngredient } from '@utils/test-fixtures';

import { ingredientsSlice, initialState } from './ingredients-slice';
import { fetchIngredients } from './ingredients-thunks';

describe('ingredientsSlice', () => {
  it('returns the initial state', () => {
    const result = ingredientsSlice.reducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });

  it('sets loading state while ingredients are requested', () => {
    const result = ingredientsSlice.reducer(
      {
        ...initialState,
        error: 'Previous error',
      },
      fetchIngredients.pending('request-id')
    );

    expect(result).toEqual({
      error: '',
      isLoading: true,
      items: [],
    });
  });

  it('stores ingredients after successful request', () => {
    const ingredients = [bunIngredient, mainIngredient];
    const result = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoading: true,
      },
      fetchIngredients.fulfilled(ingredients, 'request-id')
    );

    expect(result).toEqual({
      error: '',
      isLoading: false,
      items: ingredients,
    });
  });

  it('stores an error after failed request', () => {
    const result = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoading: true,
        items: [bunIngredient],
      },
      fetchIngredients.rejected(new Error('Network error'), 'request-id')
    );

    expect(result).toEqual({
      error: 'Не удалось загрузить ингредиенты. Попробуйте обновить страницу.',
      isLoading: false,
      items: [bunIngredient],
    });
  });
});
