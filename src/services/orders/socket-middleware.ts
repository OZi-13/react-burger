import { refreshAuthToken } from '@utils/api';
import { saveOrderIdCache } from '@utils/order-id-cache';
import { getAccessToken } from '@utils/tokens';

import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware,
} from '@reduxjs/toolkit';
import type { TOrdersResponse } from '@utils/types';

type TSocketActions = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TOrdersResponse>;
  onOpen: ActionCreatorWithoutPayload;
};

type TSocketMiddlewareOptions = {
  actions: TSocketActions;
  reconnectPeriod?: number;
  withTokenRefresh?: boolean;
};

type TSocketErrorResponse = {
  message?: string;
  success?: boolean;
};

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';

const getToken = (): string => {
  return getAccessToken()?.replace('Bearer ', '') ?? '';
};

export const createSocketMiddleware = ({
  actions,
  reconnectPeriod = 3000,
  withTokenRefresh = false,
}: TSocketMiddlewareOptions): Middleware => {
  let currentUrl = '';
  let isIntentionalConnection = false;
  let reconnectTimerId: ReturnType<typeof setTimeout> | null = null;
  let ws: WebSocket | null = null;

  const clearReconnectTimer = (): void => {
    if (reconnectTimerId) {
      clearTimeout(reconnectTimerId);
      reconnectTimerId = null;
    }
  };

  return (store) => {
    const closeSocket = (): void => {
      if (ws) {
        ws.onclose = null;
        ws.close();
        ws = null;
      }
    };

    const connectSocket = (url: string): void => {
      clearReconnectTimer();
      closeSocket();
      currentUrl = url;
      ws = new WebSocket(url);

      ws.onopen = (): void => {
        store.dispatch(actions.onOpen());
      };

      ws.onerror = (): void => {
        store.dispatch(actions.onError('Ошибка WebSocket-соединения'));
      };

      ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as TOrdersResponse & TSocketErrorResponse;

          if (withTokenRefresh && data.message === INVALID_TOKEN_MESSAGE) {
            isIntentionalConnection = false;
            closeSocket();

            refreshAuthToken()
              .then(() => {
                const urlWithToken = new URL(currentUrl);
                urlWithToken.searchParams.set('token', getToken());
                isIntentionalConnection = true;
                connectSocket(urlWithToken.toString());
              })
              .catch(() => {
                store.dispatch(actions.onError('Не удалось обновить токен'));
              });

            return;
          }

          if (!data.success) {
            store.dispatch(actions.onError(data.message ?? 'Ошибка получения заказов'));

            return;
          }

          saveOrderIdCache(data.orders);
          store.dispatch(actions.onMessage(data));
        } catch {
          store.dispatch(actions.onError('Ошибка обработки данных заказов'));
        }
      };

      ws.onclose = (): void => {
        store.dispatch(actions.onClose());
        ws = null;

        if (isIntentionalConnection) {
          reconnectTimerId = setTimeout(() => {
            connectSocket(currentUrl);
          }, reconnectPeriod);
        }
      };
    };

    return (next) => (action) => {
      if (actions.connect.match(action)) {
        isIntentionalConnection = true;
        connectSocket(action.payload);
      }

      if (actions.disconnect.match(action)) {
        isIntentionalConnection = false;
        clearReconnectTimer();
        closeSocket();
      }

      return next(action);
    };
  };
};
