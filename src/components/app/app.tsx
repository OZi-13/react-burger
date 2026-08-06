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
  clearCurrentIngredient,
  selectCurrentIngredient,
} from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
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

import type { TPagePath } from '@components/app-header/app-header';

import styles from './app.module.css';

type TPlaceholderPageProps = {
  title: string;
};

type TConstructorPageProps = {
  error: string;
  isLoading: boolean;
  onOrderClick: () => void;
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
  error,
  isLoading,
  onOrderClick,
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
            <BurgerIngredients />
            <BurgerConstructor onOrderClick={onOrderClick} />
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

  const handleOrderClick = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    dispatch(clearCurrentIngredient());
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader activePath={activePath} onNavigate={handleNavigate} />
      {activePath === '/' && (
        <ConstructorPage
          error={error}
          isLoading={isLoading}
          onOrderClick={handleOrderClick}
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
