import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { PageHeader } from '@components/page-header/page-header';
import { getIngredients } from '@utils/api';

import type { TPagePath } from '@components/app-header/app-header';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './app.module.css';

type TConstructorIngredients = {
  bun?: TIngredient;
  fillings: TConstructorIngredient[];
};

type TPlaceholderPageProps = {
  title: string;
};

type TConstructorPageProps = {
  burgerConstructorIngredients: TConstructorIngredients;
  error: string;
  ingredientCounts: Record<string, number>;
  ingredients: TIngredient[];
  isLoading: boolean;
  onIngredientClick: (ingredient: TIngredient) => void;
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onOrderClick: () => void;
};

const getConstructorIngredients = (
  ingredients: TIngredient[]
): TConstructorIngredients => {
  const selectedBun =
    ingredients.find((ingredient) => ingredient.name === 'Краторная булка N-200i') ??
    ingredients.find((ingredient) => ingredient.type === 'bun');

  const selectedFillings = [
    ingredients.find(
      (ingredient) => ingredient.name === 'Соус традиционный галактический'
    ),
    ingredients.find(
      (ingredient) => ingredient.name === 'Мясо бессмертных моллюсков Protostomia'
    ),
    ingredients.find((ingredient) => ingredient.name === 'Плоды Фалленианского дерева'),
    ingredients.find((ingredient) => ingredient.name === 'Хрустящие минеральные кольца'),
    ingredients.find((ingredient) => ingredient.name === 'Хрустящие минеральные кольца'),
  ]
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient))
    .map((ingredient, index) => ({
      ...ingredient,
      constructorId: `${ingredient._id}-${index}`,
    }));

  return {
    bun: selectedBun,
    fillings: selectedFillings,
  };
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
  burgerConstructorIngredients,
  error,
  ingredientCounts,
  ingredients,
  isLoading,
  onIngredientClick,
  onMoveIngredient,
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
            <BurgerIngredients
              ingredientCounts={ingredientCounts}
              ingredients={ingredients}
              onIngredientClick={onIngredientClick}
            />
            <BurgerConstructor
              bun={burgerConstructorIngredients.bun}
              fillings={burgerConstructorIngredients.fillings}
              onMoveIngredient={onMoveIngredient}
              onOrderClick={onOrderClick}
            />
          </>
        )}
      </main>
    </>
  );
};

export const App = (): React.JSX.Element => {
  const [activePath, setActivePath] = useState<TPagePath>(getCurrentPath);
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [burgerConstructorIngredients, setBurgerConstructorIngredients] =
    useState<TConstructorIngredients>({
      fillings: [],
    });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
        setBurgerConstructorIngredients(getConstructorIngredients(data));
      })
      .catch(() => {
        setError('Не удалось загрузить ингредиенты. Попробуйте обновить страницу.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

  const handleIngredientClick = useCallback((ingredient: TIngredient): void => {
    setSelectedIngredient(ingredient);
  }, []);

  const handleOrderClick = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setSelectedIngredient(null);
    setIsOrderModalOpen(false);
  }, []);

  const handleMoveConstructorIngredient = useCallback(
    (dragIndex: number, hoverIndex: number): void => {
      setBurgerConstructorIngredients((currentIngredients) => {
        const nextFillings = [...currentIngredients.fillings];
        const [draggedIngredient] = nextFillings.splice(dragIndex, 1);

        if (!draggedIngredient) {
          return currentIngredients;
        }

        nextFillings.splice(hoverIndex, 0, draggedIngredient);

        return {
          ...currentIngredients,
          fillings: nextFillings,
        };
      });
    },
    []
  );

  const ingredientCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    if (burgerConstructorIngredients.bun) {
      counts[burgerConstructorIngredients.bun._id] = 2;
    }

    burgerConstructorIngredients.fillings.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }, [burgerConstructorIngredients]);

  return (
    <div className={styles.app}>
      <AppHeader activePath={activePath} onNavigate={handleNavigate} />
      {activePath === '/' && (
        <ConstructorPage
          burgerConstructorIngredients={burgerConstructorIngredients}
          error={error}
          ingredientCounts={ingredientCounts}
          ingredients={ingredients}
          isLoading={isLoading}
          onIngredientClick={handleIngredientClick}
          onMoveIngredient={handleMoveConstructorIngredient}
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
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
