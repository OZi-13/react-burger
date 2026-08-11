import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/auth/auth-slice';
import {
  addConstructorIngredient,
  clearConstructor,
  moveConstructorIngredient,
  removeConstructorIngredient,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
} from '@services/burger-constructor/burger-constructor-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectOrderIsLoading } from '@services/order/order-slice';
import { createOrderThunk } from '@services/order/order-thunks';

import type { TConstructorIngredient, TIngredient } from '@utils/types';
import type { Identifier } from 'dnd-core';

import styles from './burger-constructor.module.css';

const CONSTRUCTOR_INGREDIENT_TYPE = 'constructorIngredient';

type TConstructorIngredientDragItem = {
  index: number;
};

type TIngredientDragItem = {
  ingredient: TIngredient;
};

type TBurgerConstructorProps = {
  onOrderClick: () => void;
};

type TConstructorIngredientProps = {
  index: number;
  ingredient: TConstructorIngredient;
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onRemoveIngredient: (constructorId: string) => void;
};

const ConstructorIngredient = ({
  index,
  ingredient,
  onMoveIngredient,
  onRemoveIngredient,
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

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

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
        handleClose={() => onRemoveIngredient(ingredient.constructorId)}
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const bun = useAppSelector(selectConstructorBun);
  const fillings = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);

  const [{ canDrop, isOver }, drop] = useDrop<
    TIngredientDragItem,
    void,
    { canDrop: boolean; isOver: boolean }
  >({
    accept: 'ingredient',
    canDrop: (item) => Boolean(item.ingredient),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: (item) => {
      dispatch(addConstructorIngredient(item.ingredient));
    },
  });

  const isDropActive = canDrop && isOver;

  const renderBunPlaceholder = (position: 'top' | 'bottom'): React.JSX.Element => {
    return (
      <div
        className={`${styles.placeholder} ${
          position === 'top' ? styles.placeholder_top : styles.placeholder_bottom
        } ml-8${isDropActive ? ` ${styles.placeholder_active}` : ''}`}
      >
        <span className="text text_type_main-default text_color_inactive">
          Перетащите булку
        </span>
      </div>
    );
  };

  const handleMoveIngredient = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveConstructorIngredient({ dragIndex, hoverIndex }));
  };

  const handleRemoveIngredient = (constructorId: string): void => {
    dispatch(removeConstructorIngredient(constructorId));
  };

  const handleOrderClick = (): void => {
    if (!bun) {
      return;
    }

    if (!user) {
      void navigate('/login', {
        state: { from: location },
      });
      return;
    }

    const orderIngredients = [
      bun._id,
      ...fillings.map((ingredient) => ingredient._id),
      bun._id,
    ];

    onOrderClick();
    void dispatch(createOrderThunk(orderIngredients))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => undefined);
  };

  return (
    <section
      ref={drop}
      className={`${styles.burger_constructor} pt-15`}
      data-testid="burger-constructor"
    >
      {bun ? (
        <ConstructorElement
          extraClass="ml-8"
          isLocked
          price={bun.price}
          text={`${bun.name} (верх)`}
          thumbnail={bun.image}
          type="top"
        />
      ) : (
        renderBunPlaceholder('top')
      )}
      <ul className={`${styles.list} custom-scroll mt-4 mb-4`}>
        {fillings.length > 0 ? (
          fillings.map((ingredient, index) => (
            <ConstructorIngredient
              key={ingredient.constructorId}
              index={index}
              ingredient={ingredient}
              onMoveIngredient={handleMoveIngredient}
              onRemoveIngredient={handleRemoveIngredient}
            />
          ))
        ) : (
          <li
            className={`${styles.placeholder} ${styles.placeholder_middle}${
              isDropActive ? ` ${styles.placeholder_active}` : ''
            }`}
          >
            <span className="text text_type_main-default text_color_inactive">
              Перетащите ингредиенты
            </span>
          </li>
        )}
      </ul>
      {bun ? (
        <ConstructorElement
          extraClass="ml-8"
          isLocked
          price={bun.price}
          text={`${bun.name} (низ)`}
          thumbnail={bun.image}
          type="bottom"
        />
      ) : (
        renderBunPlaceholder('bottom')
      )}
      <div className={`${styles.order} mt-10`}>
        <span className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </span>
        <Button
          disabled={!bun || fillings.length === 0 || !isAuthChecked || isOrderLoading}
          htmlType="button"
          size="large"
          type="primary"
          onClick={handleOrderClick}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
