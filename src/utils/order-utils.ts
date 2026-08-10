import type { TIngredient, TOrder, TOrderStatus } from './types';

export type TOrderIngredientGroup = {
  count: number;
  ingredient: TIngredient;
};

const statusText: Record<TOrderStatus, string> = {
  created: 'Создан',
  done: 'Выполнен',
  pending: 'Готовится',
};

export const getOrderStatusText = (status: TOrderStatus): string => {
  return statusText[status];
};

export const formatOrderNumber = (number: number): string => {
  return `#${String(number).padStart(6, '0')}`;
};

export const formatOrderDate = (date: string): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZoneName: 'short',
  }).format(new Date(date));
};

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  return order.ingredients
    .map((ingredientId) =>
      ingredients.find((ingredient) => ingredient._id === ingredientId)
    )
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
};

export const getOrderPrice = (order: TOrder, ingredients: TIngredient[]): number => {
  return getOrderIngredients(order, ingredients).reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
};

export const getGroupedOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TOrderIngredientGroup[] => {
  const groupedIngredients = new Map<string, TOrderIngredientGroup>();

  getOrderIngredients(order, ingredients).forEach((ingredient) => {
    const group = groupedIngredients.get(ingredient._id);

    if (group) {
      group.count += 1;

      return;
    }

    groupedIngredients.set(ingredient._id, {
      count: 1,
      ingredient,
    });
  });

  return Array.from(groupedIngredients.values());
};

export const splitStatusNumbers = (
  orders: TOrder[],
  status: TOrderStatus
): number[][] => {
  const numbers = orders
    .filter((order) => order.status === status)
    .slice(0, 20)
    .map((order) => order.number);

  return [numbers.slice(0, 10), numbers.slice(10, 20)].filter(
    (column) => column.length > 0
  );
};
