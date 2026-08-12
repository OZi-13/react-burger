import type { TConstructorIngredient, TIngredient, TOrder, TUser } from './types';

export const bunIngredient: TIngredient = {
  __v: 0,
  _id: 'bun-id',
  calories: 420,
  carbohydrates: 53,
  fat: 24,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  name: 'Краторная булка',
  price: 1255,
  proteins: 80,
  type: 'bun',
};

export const sauceIngredient: TIngredient = {
  __v: 0,
  _id: 'sauce-id',
  calories: 30,
  carbohydrates: 40,
  fat: 20,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  name: 'Соус Spicy-X',
  price: 90,
  proteins: 10,
  type: 'sauce',
};

export const mainIngredient: TIngredient = {
  __v: 0,
  _id: 'main-id',
  calories: 2674,
  carbohydrates: 300,
  fat: 800,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png',
  name: 'Биокотлета',
  price: 424,
  proteins: 420,
  type: 'main',
};

export const constructorSauce: TConstructorIngredient = {
  ...sauceIngredient,
  constructorId: 'constructor-sauce-id',
};

export const constructorMain: TConstructorIngredient = {
  ...mainIngredient,
  constructorId: 'constructor-main-id',
};

export const user: TUser = {
  email: 'user@example.com',
  name: 'User',
};

export const order: TOrder = {
  _id: 'order-id',
  createdAt: '2026-08-11T09:00:00.000Z',
  ingredients: [bunIngredient._id, mainIngredient._id, bunIngredient._id],
  name: 'Краторный бургер',
  number: 12345,
  status: 'done',
  updatedAt: '2026-08-11T09:01:00.000Z',
};
