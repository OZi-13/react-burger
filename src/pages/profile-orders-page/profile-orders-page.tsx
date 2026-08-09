import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersIsLoading,
} from '@services/orders/orders-slice';
import { PROFILE_ORDERS_WS_URL } from '@utils/constants';
import { getAccessToken } from '@utils/tokens';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectProfileOrders);
  const isLoading = useAppSelector(selectProfileOrdersIsLoading);
  const error = useAppSelector(selectProfileOrdersError);

  useEffect(() => {
    const token = getAccessToken()?.replace('Bearer ', '');

    if (!token) {
      return undefined;
    }

    dispatch(profileOrdersConnect(`${PROFILE_ORDERS_WS_URL}?token=${token}`));

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  return (
    <section className={styles.orders}>
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
          <p className="text text_type_main-default">История заказов пока пуста</p>
        </div>
      )}
      {orders.length > 0 && (
        <ul className={`${styles.list} custom-scroll pr-2`}>
          {orders.map((order) => (
            <li key={order._id}>
              <OrderCard
                ingredients={ingredients}
                order={order}
                showStatus
                state={{ background: location }}
                to={`/profile/orders/${order.number}`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
