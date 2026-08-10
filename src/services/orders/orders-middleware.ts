import {
  feedConnect,
  feedDisconnect,
  feedOnClose,
  feedOnError,
  feedOnMessage,
  feedOnOpen,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} from './orders-slice';
import { createSocketMiddleware } from './socket-middleware';

export const feedSocketMiddleware = createSocketMiddleware({
  actions: {
    connect: feedConnect,
    disconnect: feedDisconnect,
    onClose: feedOnClose,
    onError: feedOnError,
    onMessage: feedOnMessage,
    onOpen: feedOnOpen,
  },
});

export const profileOrdersSocketMiddleware = createSocketMiddleware({
  actions: {
    connect: profileOrdersConnect,
    disconnect: profileOrdersDisconnect,
    onClose: profileOrdersOnClose,
    onError: profileOrdersOnError,
    onMessage: profileOrdersOnMessage,
    onOpen: profileOrdersOnOpen,
  },
  withTokenRefresh: true,
});
