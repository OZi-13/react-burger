import { bunIngredient } from '@utils/test-fixtures';

import {
  clearCurrentIngredient,
  currentIngredientSlice,
  initialState,
  setCurrentIngredient,
} from './current-ingredient-slice';

describe('currentIngredientSlice', () => {
  it('returns the initial state', () => {
    const result = currentIngredientSlice.reducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });

  it('sets the current ingredient', () => {
    const result = currentIngredientSlice.reducer(
      undefined,
      setCurrentIngredient(bunIngredient)
    );

    expect(result.ingredient).toEqual(bunIngredient);
  });

  it('clears the current ingredient', () => {
    const result = currentIngredientSlice.reducer(
      {
        ingredient: bunIngredient,
      },
      clearCurrentIngredient()
    );

    expect(result).toEqual(initialState);
  });
});
