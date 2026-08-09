import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { PageHeader } from '@components/page-header/page-header';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';
import {
  feedConnect,
  feedDisconnect,
  clearCurrentOrder,
  profileOrdersConnect,
  profileOrdersDisconnect,
  selectCurrentOrder,
  selectCurrentOrderError,
  selectCurrentOrderIsLoading,
  selectFeedIsLoading,
  selectFeedOrders,
  selectProfileOrders,
  selectProfileOrdersIsLoading,
} from '@services/orders/orders-slice';
import { fetchOrderByNumber } from '@services/orders/orders-thunks';
import { ORDERS_FEED_WS_URL, PROFILE_ORDERS_WS_URL } from '@utils/constants';
import { getAccessToken } from '@utils/tokens';

import type { TOrder } from '@utils/types';

import styles from './order-page.module.css';

type TOrderPageProps = {
  connectOnMount?: boolean;
  isModal?: boolean;
  source: 'feed' | 'profile';
};

export const OrderPage = ({
  connectOnMount = false,
  isModal = false,
  source,
}: TOrderPageProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { number } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const ingredientsError = useAppSelector(selectIngredientsError);
  const ingredientsIsLoading = useAppSelector(selectIngredientsIsLoading);
  const feedOrders = useAppSelector(selectFeedOrders);
  const feedIsLoading = useAppSelector(selectFeedIsLoading);
  const profileOrders = useAppSelector(selectProfileOrders);
  const profileOrdersIsLoading = useAppSelector(selectProfileOrdersIsLoading);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const currentOrderError = useAppSelector(selectCurrentOrderError);
  const currentOrderIsLoading = useAppSelector(selectCurrentOrderIsLoading);

  const sourceOrders = source === 'feed' ? feedOrders : profileOrders;
  const order = useMemo<TOrder | null>(() => {
    const orderFromSocket = sourceOrders.find((item) => String(item.number) === number);

    if (orderFromSocket) {
      return orderFromSocket;
    }

    if (currentOrder && String(currentOrder.number) === number) {
      return currentOrder;
    }

    return null;
  }, [currentOrder, number, sourceOrders]);

  useEffect(() => {
    if (!connectOnMount) {
      return;
    }

    if (source === 'feed') {
      dispatch(feedConnect(ORDERS_FEED_WS_URL));

      return (): void => {
        dispatch(feedDisconnect());
      };
    }

    const token = getAccessToken()?.replace('Bearer ', '');

    if (!token) {
      return;
    }

    dispatch(profileOrdersConnect(`${PROFILE_ORDERS_WS_URL}?token=${token}`));

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [connectOnMount, dispatch, source]);

  useEffect(() => {
    const sourceIsLoading = source === 'feed' ? feedIsLoading : profileOrdersIsLoading;

    if (
      !number ||
      order ||
      currentOrderIsLoading ||
      sourceIsLoading ||
      (connectOnMount && sourceOrders.length === 0)
    ) {
      return;
    }

    void dispatch(fetchOrderByNumber(number));
  }, [
    connectOnMount,
    currentOrderIsLoading,
    dispatch,
    feedIsLoading,
    number,
    order,
    profileOrdersIsLoading,
    source,
    sourceOrders.length,
  ]);

  useEffect(() => {
    return (): void => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  const content = (
    <div className={styles.status}>
      {(ingredientsIsLoading || currentOrderIsLoading) && <Preloader />}
      {ingredientsError && (
        <p className="text text_type_main-default">{ingredientsError}</p>
      )}
      {currentOrderError && (
        <p className="text text_type_main-default">{currentOrderError}</p>
      )}
      {!ingredientsIsLoading &&
        !currentOrderIsLoading &&
        !ingredientsError &&
        !currentOrderError &&
        order && <OrderInfo order={order} ingredients={ingredients} isModal={isModal} />}
      {!ingredientsIsLoading &&
        !currentOrderIsLoading &&
        !ingredientsError &&
        !currentOrderError &&
        !order && <p className="text text_type_main-default">Заказ не найден</p>}
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <>
      <PageHeader title="Информация о заказе" />
      <main className={`${styles.page} pl-5 pr-5`}>{content}</main>
    </>
  );
};
