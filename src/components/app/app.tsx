import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { PageHeader } from '@components/page-header/page-header';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TConstructorIngredients = {
  bun?: TIngredient;
  fillings: TIngredient[];
};

type TPlaceholderPageProps = {
  title: string;
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
  ].filter((ingredient): ingredient is TIngredient => Boolean(ingredient));

  return {
    bun: selectedBun,
    fillings: selectedFillings,
  };
};

const PlaceholderPage = ({ title }: TPlaceholderPageProps): React.JSX.Element => {
  return <PageHeader title={title} />;
};

const ConstructorPage = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch(() => {
        setError('Не удалось загрузить ингредиенты. Попробуйте обновить страницу.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

  const burgerConstructorIngredients = useMemo(
    () => getConstructorIngredients(ingredients),
    [ingredients]
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
              onIngredientClick={handleIngredientClick}
            />
            <BurgerConstructor
              bun={burgerConstructorIngredients.bun}
              fillings={burgerConstructorIngredients.fillings}
              onOrderClick={handleOrderClick}
            />
          </>
        )}
      </main>
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
    </>
  );
};

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<PlaceholderPage title="Лента заказов" />} />
        <Route path="/profile" element={<PlaceholderPage title="Личный кабинет" />} />
      </Routes>
    </div>
  );
};

export default App;
