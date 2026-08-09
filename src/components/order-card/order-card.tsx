import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import {
  formatOrderDate,
  formatOrderNumber,
  getOrderIngredients,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/order-utils';

import type { TIngredient, TOrder } from '@utils/types';
import type { Location } from 'react-router-dom';

import styles from './order-card.module.css';

type TOrderCardProps = {
  ingredients: TIngredient[];
  order: TOrder;
  showStatus?: boolean;
  state?: { background: Location };
  to: string;
};

const MAX_VISIBLE_INGREDIENTS = 6;

export const OrderCard = ({
  ingredients,
  order,
  showStatus = false,
  state,
  to,
}: TOrderCardProps): React.JSX.Element => {
  const orderIngredients = getOrderIngredients(order, ingredients);
  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = Math.max(orderIngredients.length - MAX_VISIBLE_INGREDIENTS, 0);
  const price = getOrderPrice(order, ingredients);

  return (
    <Link className={`${styles.card} p-6`} to={to} state={state}>
      <div className={styles.meta}>
        <span className="text text_type_digits-default">
          {formatOrderNumber(order.number)}
        </span>
        <time
          className="text text_type_main-default text_color_inactive"
          dateTime={order.createdAt}
        >
          {formatOrderDate(order.createdAt)}
        </time>
      </div>
      <h2 className={`${styles.title} text text_type_main-medium mt-6`}>{order.name}</h2>
      {showStatus && (
        <p
          className={`${styles.status} ${
            order.status === 'done' ? styles.status_done : ''
          } text text_type_main-default mt-2`}
        >
          {getOrderStatusText(order.status)}
        </p>
      )}
      <div className={`${styles.summary} mt-6`}>
        <ul className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => {
            const isLastVisible =
              index === MAX_VISIBLE_INGREDIENTS - 1 && hiddenCount > 0;

            return (
              <li
                key={`${ingredient._id}-${index}`}
                className={styles.ingredient}
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <img
                  className={styles.image}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLastVisible && (
                  <span className={`${styles.count} text text_type_main-default`}>
                    +{hiddenCount}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
