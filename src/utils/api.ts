import { BURGER_API_URL } from '@utils/constants';

import type { TIngredientsResponse, TIngredient } from '@utils/types';

const checkResponse = <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    return Promise.reject(new Error(`Ошибка запроса: ${response.status}`));
  }

  return response.json() as Promise<T>;
};

let ingredientsRequest: Promise<TIngredient[]> | null = null;

export const getIngredients = (): Promise<TIngredient[]> => {
  ingredientsRequest ??= fetch(`${BURGER_API_URL}/ingredients`)
    .then((response) => checkResponse<TIngredientsResponse>(response))
    .then((response) => {
      if (!response.success) {
        return Promise.reject(new Error('API вернул неуспешный ответ'));
      }

      return response.data;
    })
    .catch((error: unknown) => {
      ingredientsRequest = null;

      if (error instanceof Error) {
        return Promise.reject(error);
      }

      return Promise.reject(new Error('Неизвестная ошибка запроса'));
    });

  return ingredientsRequest;
};
