import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TConstructorIngredient, TIngredient } from '@utils/types';
import type { Identifier, XYCoord } from 'dnd-core';

import styles from './burger-constructor.module.css';

const CONSTRUCTOR_INGREDIENT_TYPE = 'constructorIngredient';

type TConstructorIngredientDragItem = {
  index: number;
};

type TBurgerConstructorProps = {
  bun?: TIngredient;
  fillings: TConstructorIngredient[];
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onOrderClick: () => void;
};

type TConstructorIngredientProps = {
  index: number;
  ingredient: TConstructorIngredient;
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
};

const ConstructorIngredient = ({
  index,
  ingredient,
  onMoveIngredient,
}: TConstructorIngredientProps): React.JSX.Element => {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<
    TConstructorIngredientDragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: CONSTRUCTOR_INGREDIENT_TYPE,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor): void => {
      if (!itemRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = itemRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMoveIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    TConstructorIngredientDragItem,
    void,
    { isDragging: boolean }
  >({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ index }),
    type: CONSTRUCTOR_INGREDIENT_TYPE,
  });

  drag(dragHandleRef);
  drop(itemRef);

  return (
    <li
      ref={itemRef}
      className={`${styles.item}${isDragging ? ` ${styles.item_dragging}` : ''}`}
      data-handler-id={handlerId ? String(handlerId) : undefined}
    >
      <button
        ref={dragHandleRef}
        className={styles.drag_handle}
        type="button"
        aria-label="Переместить"
      >
        <DragIcon type="primary" />
      </button>
      <ConstructorElement
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  bun,
  fillings,
  onMoveIngredient,
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
          <ConstructorIngredient
            key={ingredient.constructorId}
            index={index}
            ingredient={ingredient}
            onMoveIngredient={onMoveIngredient}
          />
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
