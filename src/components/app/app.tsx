import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { PageHeader } from '@components/page-header/page-header';
import {
  addConstructorIngredient,
  moveConstructorIngredient,
  removeConstructorIngredient,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
  selectIngredientCounts,
} from '@services/burger-constructor/burger-constructor-slice';
import {
  clearCurrentIngredient,
  selectCurrentIngredient,
  setCurrentIngredient,
} from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';
import { fetchIngredients } from '@services/ingredients/ingredients-thunks';
import {
  clearOrder,
  selectOrderError,
  selectOrderIsLoading,
  selectOrderNumber,
} from '@services/order/order-slice';
import { createOrderThunk } from '@services/order/order-thunks';

import type { TPagePath } from '@components/app-header/app-header';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './app.module.css';

type TPlaceholderPageProps = {
  title: string;
};

type TConstructorPageProps = {
  bun: TIngredient | null;
  error: string;
  fillings: TConstructorIngredient[];
  ingredientCounts: Record<string, number>;
  ingredients: TIngredient[];
  isLoading: boolean;
  isOrderLoading: boolean;
  onIngredientClick: (ingredient: TIngredient) => void;
  onIngredientDrop: (ingredient: TIngredient) => void;
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onOrderClick: () => void;
  onRemoveIngredient: (constructorId: string) => void;
  totalPrice: number;
};

const PlaceholderPage = ({ title }: TPlaceholderPageProps): React.JSX.Element => {
  return <PageHeader title={title} />;
};

const getCurrentPath = (): TPagePath => {
  const { pathname } = window.location;

  if (pathname === '/feed' || pathname === '/profile') {
    return pathname;
  }

  return '/';
};

const ConstructorPage = ({
  bun,
  error,
  fillings,
  ingredientCounts,
  ingredients,
  isLoading,
  isOrderLoading,
  onIngredientClick,
  onIngredientDrop,
  onMoveIngredient,
  onOrderClick,
  onRemoveIngredient,
  totalPrice,
}: TConstructorPageProps): React.JSX.Element => {
  return (
    <>
      <PageHeader title="Соберите бургер" />
      <main className={`${styles.main} pl-5 pr-5`}>
        {isLoading && (
          <div className={styles.status}>
            <Preloader />
          </div>
        )}
        {error && (
          <div className={styles.status}>
            <p className="text text_type_main-default">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <BurgerIngredients
              ingredientCounts={ingredientCounts}
              ingredients={ingredients}
              onIngredientClick={onIngredientClick}
            />
            <BurgerConstructor
              bun={bun}
              fillings={fillings}
              isOrderLoading={isOrderLoading}
              totalPrice={totalPrice}
              onIngredientDrop={onIngredientDrop}
              onMoveIngredient={onMoveIngredient}
              onOrderClick={onOrderClick}
              onRemoveIngredient={onRemoveIngredient}
            />
          </>
        )}
      </main>
    </>
  );
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [activePath, setActivePath] = useState<TPagePath>(getCurrentPath);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const bun = useAppSelector(selectConstructorBun);
  const fillings = useAppSelector(selectConstructorIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const orderNumber = useAppSelector(selectOrderNumber);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const orderError = useAppSelector(selectOrderError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const handlePopState = (): void => {
      setActivePath(getCurrentPath());
    };

    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = useCallback(
    (path: TPagePath): void => {
      if (path !== activePath) {
        window.history.pushState(null, '', path);
        setActivePath(path);
      }
    },
    [activePath]
  );

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(setCurrentIngredient(ingredient));
    },
    [dispatch]
  );

  const handleIngredientDrop = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(addConstructorIngredient(ingredient));
    },
    [dispatch]
  );

  const handleOrderClick = useCallback((): void => {
    if (!bun) {
      return;
    }

    const orderIngredients = [
      bun._id,
      ...fillings.map((ingredient) => ingredient._id),
      bun._id,
    ];

    setIsOrderModalOpen(true);
    void dispatch(createOrderThunk(orderIngredients));
  }, [bun, dispatch, fillings]);

  const handleCloseModal = useCallback((): void => {
    dispatch(clearCurrentIngredient());
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);

  const handleMoveConstructorIngredient = useCallback(
    (dragIndex: number, hoverIndex: number): void => {
      dispatch(moveConstructorIngredient({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  const handleRemoveConstructorIngredient = useCallback(
    (constructorId: string): void => {
      dispatch(removeConstructorIngredient(constructorId));
    },
    [dispatch]
  );

  return (
    <div className={styles.app}>
      <AppHeader activePath={activePath} onNavigate={handleNavigate} />
      {activePath === '/' && (
        <ConstructorPage
          bun={bun}
          error={error}
          fillings={fillings}
          ingredientCounts={ingredientCounts}
          ingredients={ingredients}
          isLoading={isLoading}
          isOrderLoading={isOrderLoading}
          onIngredientClick={handleIngredientClick}
          onIngredientDrop={handleIngredientDrop}
          onMoveIngredient={handleMoveConstructorIngredient}
          onOrderClick={handleOrderClick}
          onRemoveIngredient={handleRemoveConstructorIngredient}
          totalPrice={totalPrice}
        />
      )}
      {activePath === '/feed' && <PlaceholderPage title="Лента заказов" />}
      {activePath === '/profile' && <PlaceholderPage title="Личный кабинет" />}
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails
            error={orderError}
            isLoading={isOrderLoading}
            orderNumber={orderNumber}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
