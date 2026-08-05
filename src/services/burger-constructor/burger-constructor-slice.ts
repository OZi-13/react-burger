import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  initialState,
  name: 'burgerConstructor',
  reducers: {
    addConstructorIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: nanoid(),
        },
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;

          return;
        }

        state.ingredients.push(action.payload);
      },
    },
    moveConstructorIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const [draggedIngredient] = state.ingredients.splice(dragIndex, 1);

      if (!draggedIngredient) {
        return;
      }

      state.ingredients.splice(hoverIndex, 0, draggedIngredient);
    },
    removeConstructorIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },
  },
  selectors: {
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients,
  },
});

export const {
  addConstructorIngredient,
  moveConstructorIngredient,
  removeConstructorIngredient,
} = burgerConstructorSlice.actions;

export const { selectConstructorBun, selectConstructorIngredients } =
  burgerConstructorSlice.selectors;

export const selectIngredientCounts = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);
