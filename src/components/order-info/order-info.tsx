import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import {
  formatOrderDate,
  formatOrderNumber,
  getGroupedOrderIngredients,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/order-utils';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  ingredients: TIngredient[];
  isModal?: boolean;
  order: TOrder;
};

export const OrderInfo = ({
  ingredients,
  isModal = false,
  order,
}: TOrderInfoProps): React.JSX.Element => {
  const groupedIngredients = getGroupedOrderIngredients(order, ingredients);
  const price = getOrderPrice(order, ingredients);

  return (
    <article className={`${styles.details} ${isModal ? styles.details_modal : ''}`}>
      <p
        className={`${styles.number} text text_type_digits-default ${
          isModal ? '' : styles.number_centered
        }`}
      >
        {formatOrderNumber(order.number)}
      </p>
      <h1 className="text text_type_main-medium mt-10 mb-3">{order.name}</h1>
      <p
        className={`${styles.status} ${
          order.status === 'done' ? styles.status_done : ''
        } text text_type_main-default`}
      >
        {getOrderStatusText(order.status)}
      </p>
      <h2 className="text text_type_main-medium mt-15 mb-6">Состав:</h2>
      <ul className={`${styles.list} custom-scroll pr-6`}>
        {groupedIngredients.map(({ count, ingredient }) => (
          <li key={ingredient._id} className={styles.item}>
            <div className={styles.preview}>
              <img
                className={styles.image}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </div>
            <h3 className={`${styles.name} text text_type_main-default`}>
              {ingredient.name}
            </h3>
            <div className={styles.price}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <footer className={`${styles.footer} mt-10`}>
        <time
          className="text text_type_main-default text_color_inactive"
          dateTime={order.createdAt}
        >
          {formatOrderDate(order.createdAt)}
        </time>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </article>
  );
};
