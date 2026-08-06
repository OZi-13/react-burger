import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { PageHeader } from '@components/page-header/page-header';
import { useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);

  const ingredient = useMemo(
    () => ingredients.find((item) => item._id === id),
    [id, ingredients]
  );

  return (
    <>
      <PageHeader title="Детали ингредиента" />
      <main className={`${styles.page} pl-5 pr-5`}>
        {isLoading && <Preloader />}
        {error && <p className="text text_type_main-default">{error}</p>}
        {!isLoading && !error && ingredient && (
          <IngredientDetails ingredient={ingredient} />
        )}
        {!isLoading && !error && !ingredient && (
          <p className="text text_type_main-default">Ингредиент не найден</p>
        )}
      </main>
    </>
  );
};
