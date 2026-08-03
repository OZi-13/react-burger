import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredientCounts: Record<string, number>;
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

const INGREDIENT_TYPES = [
  { title: 'Булки', value: 'bun' },
  { title: 'Соусы', value: 'sauce' },
  { title: 'Начинки', value: 'main' },
] as const;

export const BurgerIngredients = ({
  ingredientCounts,
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const ingredientsByType = useMemo(() => {
    return INGREDIENT_TYPES.map((ingredientType) => ({
      ...ingredientType,
      ingredients: ingredients.filter(
        (ingredient) => ingredient.type === ingredientType.value
      ),
    }));
  }, [ingredients]);

  const handleTabClick = (value: string): void => {
    setCurrentTab(value);

    const scrollContainer = scrollContainerRef.current;
    const section = sectionRefs.current[value];

    if (scrollContainer && section) {
      const top =
        section.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop;

      scrollContainer.scrollTo({
        behavior: 'smooth',
        top,
      });
    }
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.tabs}>
        {INGREDIENT_TYPES.map((ingredientType) => (
          <Tab
            key={ingredientType.value}
            active={currentTab === ingredientType.value}
            value={ingredientType.value}
            onClick={handleTabClick}
          >
            {ingredientType.title}
          </Tab>
        ))}
      </nav>
      <div ref={scrollContainerRef} className={`${styles.scroll} custom-scroll`}>
        {ingredientsByType.map((ingredientType) => (
          <section
            key={ingredientType.value}
            id={ingredientType.value}
            className="mb-10"
            ref={(node) => {
              sectionRefs.current[ingredientType.value] = node;
            }}
          >
            <h2 className="text text_type_main-medium mb-6">{ingredientType.title}</h2>
            <ul className={`${styles.list} pl-4 pr-4`}>
              {ingredientType.ingredients.map((ingredient) => (
                <li key={ingredient._id} className={styles.item}>
                  <button
                    className={styles.card}
                    type="button"
                    onClick={() => onIngredientClick(ingredient)}
                  >
                    {Boolean(ingredientCounts[ingredient._id]) && (
                      <Counter count={ingredientCounts[ingredient._id]} size="default" />
                    )}
                    <img
                      className={styles.image}
                      src={ingredient.image}
                      alt={ingredient.name}
                    />
                    <span className={`${styles.price} mt-1 mb-1`}>
                      <span className="text text_type_digits-default">
                        {ingredient.price}
                      </span>
                      <CurrencyIcon type="primary" />
                    </span>
                    <span className={`${styles.name} text text_type_main-default`}>
                      {ingredient.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
