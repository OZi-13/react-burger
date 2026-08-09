import type { TOrder } from './types';

const ORDER_ID_CACHE_KEY = 'orderIdByNumber';

const readOrderIdCache = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_ID_CACHE_KEY) ?? '{}') as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
};

export const getCachedOrderId = (number: string): string | null => {
  return readOrderIdCache()[number] ?? null;
};

export const saveOrderIdCache = (orders: TOrder[]): void => {
  const cache = readOrderIdCache();

  orders.forEach((order) => {
    cache[String(order.number)] = order._id;
  });

  localStorage.setItem(ORDER_ID_CACHE_KEY, JSON.stringify(cache));
};
