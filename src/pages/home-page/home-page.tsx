import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { PageHeader } from '@components/page-header/page-header';

import styles from './home-page.module.css';

type THomePageProps = {
  error: string;
  isLoading: boolean;
  onOrderClick: () => void;
};

export const HomePage = ({
  error,
  isLoading,
  onOrderClick,
}: THomePageProps): React.JSX.Element => {
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
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor onOrderClick={onOrderClick} />
          </DndProvider>
        )}
      </main>
    </>
  );
};
