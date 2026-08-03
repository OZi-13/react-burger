import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun?: TIngredient;
  fillings: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  bun,
  fillings,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  return (
    <section className={`${styles.burger_constructor} pt-15`}>
      {bun && (
        <ConstructorElement
          extraClass="ml-8"
          isLocked
          price={bun.price}
          text={`${bun.name} (верх)`}
          thumbnail={bun.image}
          type="top"
        />
      )}
      <ul className={`${styles.list} custom-scroll mt-4 mb-4`}>
        {fillings.map((ingredient, index) => (
          <li key={`${ingredient._id}-${index}`} className={styles.item}>
            <DragIcon type="primary" />
            <ConstructorElement
              price={ingredient.price}
              text={ingredient.name}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>
      {bun && (
        <ConstructorElement
          extraClass="ml-8"
          isLocked
          price={bun.price}
          text={`${bun.name} (низ)`}
          thumbnail={bun.image}
          type="bottom"
        />
      )}
      <div className={`${styles.order} mt-10`}>
        <span className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </span>
        <Button htmlType="button" size="large" type="primary" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
