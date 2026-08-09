import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { PageHeader } from '@components/page-header/page-header';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  feedConnect,
  feedDisconnect,
  selectFeedError,
  selectFeedIsLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@services/orders/orders-slice';
import { ORDERS_FEED_WS_URL } from '@utils/constants';
import { formatOrderNumber, splitStatusNumbers } from '@utils/order-utils';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectFeedOrders);
  const isLoading = useAppSelector(selectFeedIsLoading);
  const error = useAppSelector(selectFeedError);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const doneColumns = splitStatusNumbers(orders, 'done');
  const pendingColumns = splitStatusNumbers(orders, 'pending');
  const statsRef = useRef<HTMLElement>(null);
  const [ordersHeight, setOrdersHeight] = useState<number | null>(null);

  useEffect(() => {
    dispatch(feedConnect(ORDERS_FEED_WS_URL));

    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  useLayoutEffect(() => {
    const statsElement = statsRef.current;

    if (!statsElement) {
      return undefined;
    }

    const updateOrdersHeight = (): void => {
      setOrdersHeight(statsElement.offsetHeight);
    };

    updateOrdersHeight();

    const resizeObserver = new ResizeObserver(updateOrdersHeight);
    resizeObserver.observe(statsElement);
    window.addEventListener('resize', updateOrdersHeight);

    return (): void => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOrdersHeight);
    };
  }, []);

  return (
    <>
      <PageHeader title="Лента заказов" />
      <main className={`${styles.main} pl-5 pr-5`}>
        <section className={styles.orders} style={{ height: ordersHeight ?? undefined }}>
          {isLoading && orders.length === 0 && (
            <div className={styles.status}>
              <Preloader />
            </div>
          )}
          {error && orders.length === 0 && (
            <div className={styles.status}>
              <p className="text text_type_main-default">{error}</p>
            </div>
          )}
          {!isLoading && !error && orders.length === 0 && (
            <div className={styles.status}>
              <p className="text text_type_main-default">Заказы пока не найдены</p>
            </div>
          )}
          {orders.length > 0 && (
            <ul className={`${styles.list} custom-scroll pr-2`}>
              {orders.map((order) => (
                <li key={order._id}>
                  <OrderCard
                    ingredients={ingredients}
                    order={order}
                    state={{ background: location }}
                    to={`/feed/${order.number}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section ref={statsRef} className={styles.stats}>
          <div className={styles.board}>
            <div>
              <h2 className="text text_type_main-medium mb-6">Готово:</h2>
              <div className={styles.columns}>
                {doneColumns.map((column, index) => (
                  <div key={index} className={styles.numbers}>
                    {column.map((number) => (
                      <span
                        key={number}
                        className={`${styles.number_done} text text_type_digits-default`}
                      >
                        {formatOrderNumber(number).slice(1)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>
              <div className={styles.columns}>
                {pendingColumns.map((column, index) => (
                  <div key={index} className={styles.numbers}>
                    {column.map((number) => (
                      <span key={number} className="text text_type_digits-default">
                        {formatOrderNumber(number).slice(1)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h2 className="text text_type_main-medium mt-15 mb-0">
            Выполнено за все время:
          </h2>
          <p className={`${styles.total} text text_type_digits-large mt-0 mb-15`}>
            {total}
          </p>
          <h2 className="text text_type_main-medium mb-0">Выполнено за сегодня:</h2>
          <p className={`${styles.total} text text_type_digits-large mt-0`}>
            {totalToday}
          </p>
        </section>
      </main>
    </>
  );
};
