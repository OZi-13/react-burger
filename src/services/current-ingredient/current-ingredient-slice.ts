import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TCurrentIngredientState = {
  ingredient: TIngredient | null;
};

const initialState: TCurrentIngredientState = {
  ingredient: null,
};

export const currentIngredientSlice = createSlice({
  initialState,
  name: 'currentIngredient',
  reducers: {
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
  },
  selectors: {
    selectCurrentIngredient: (state) => state.ingredient,
  },
});

export const { clearCurrentIngredient, setCurrentIngredient } =
  currentIngredientSlice.actions;
export const { selectCurrentIngredient } = currentIngredientSlice.selectors;
