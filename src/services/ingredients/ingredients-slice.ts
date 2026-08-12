import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './ingredients-thunks';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  error: string;
  isLoading: boolean;
  items: TIngredient[];
};

export const initialState: TIngredientsState = {
  error: '',
  isLoading: false,
  items: [],
};

export const ingredientsSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.error = '';
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.error = 'Не удалось загрузить ингредиенты. Попробуйте обновить страницу.';
        state.isLoading = false;
      });
  },
  initialState,
  name: 'ingredients',
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsError: (state) => state.error,
    selectIngredientsIsLoading: (state) => state.isLoading,
  },
});

export const { selectIngredients, selectIngredientsError, selectIngredientsIsLoading } =
  ingredientsSlice.selectors;
