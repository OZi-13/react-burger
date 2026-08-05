import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  error: string;
  isLoading: boolean;
  orderNumber: number | null;
};

export const OrderDetails = ({
  error,
  isLoading,
  orderNumber,
}: TOrderDetailsProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <article className={`${styles.details} pt-4 pb-30`}>
        <Preloader />
        <p className="text text_type_main-medium mt-10">Оформляем заказ</p>
      </article>
    );
  }

  if (error || orderNumber === null) {
    return (
      <article className={`${styles.details} pt-4 pb-30`}>
        <p className="text text_type_main-medium mb-4">
          {error || 'Не удалось получить номер заказа.'}
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Проверьте состав бургера и попробуйте ещё раз
        </p>
      </article>
    );
  }

  return (
    <article className={`${styles.details} pt-4 pb-30`}>
      <p className={`${styles.number} text text_type_digits-large mb-8`}>
        {orderNumber}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`${styles.icon} mb-15`}>
        <CheckMarkIcon type="success" />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </article>
  );
};
