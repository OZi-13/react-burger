import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/auth-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { currentIngredientSlice } from './current-ingredient/current-ingredient-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderSlice } from './order/order-slice';
import {
  feedSocketMiddleware,
  profileOrdersSocketMiddleware,
} from './orders/orders-middleware';
import { ordersSlice } from './orders/orders-slice';

const rootReducer = combineSlices(
  authSlice,
  ingredientsSlice,
  burgerConstructorSlice,
  currentIngredientSlice,
  orderSlice,
  ordersSlice
);

export const store = configureStore({
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedSocketMiddleware, profileOrdersSocketMiddleware),
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
