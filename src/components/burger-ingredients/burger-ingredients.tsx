import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import { selectIngredientCounts } from '@services/burger-constructor/burger-constructor-slice';
import { setCurrentIngredient } from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

const INGREDIENT_TYPES = [
  { title: 'Булки', value: 'bun' },
  { title: 'Соусы', value: 'sauce' },
  { title: 'Начинки', value: 'main' },
] as const;

const INGREDIENT_DND_TYPE = 'ingredient';

type TIngredientCardProps = {
  count: number;
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const IngredientCard = ({
  count,
  ingredient,
  onIngredientClick,
}: TIngredientCardProps): React.JSX.Element => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, drag] = useDrag<
    { ingredient: TIngredient },
    void,
    { isDragging: boolean }
  >({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { ingredient },
    type: INGREDIENT_DND_TYPE,
  });

  drag(cardRef);

  return (
    <button
      ref={cardRef}
      className={`${styles.card}${isDragging ? ` ${styles.card_dragging}` : ''}`}
      type="button"
      onClick={() => onIngredientClick(ingredient)}
    >
      {Boolean(count) && <Counter count={count} size="default" />}
      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
      <span className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </span>
      <span className={`${styles.name} text text_type_main-default`}>
        {ingredient.name}
      </span>
    </button>
  );
};

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
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

  const updateCurrentTab = useCallback((): void => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const containerTop = scrollContainer.getBoundingClientRect().top;
    let nextTab = currentTab;
    let shortestDistance = Number.POSITIVE_INFINITY;

    INGREDIENT_TYPES.forEach((ingredientType) => {
      const section = sectionRefs.current[ingredientType.value];

      if (!section) {
        return;
      }

      const distance = Math.abs(section.getBoundingClientRect().top - containerTop);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextTab = ingredientType.value;
      }
    });

    if (nextTab !== currentTab) {
      setCurrentTab(nextTab);
    }
  }, [currentTab]);

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

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(setCurrentIngredient(ingredient));
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
      <div
        ref={scrollContainerRef}
        className={`${styles.scroll} custom-scroll`}
        onScroll={updateCurrentTab}
      >
        {ingredientsByType.map((ingredientType) => (
          <section
            key={ingredientType.value}
            id={ingredientType.value}
            ref={(node) => {
              sectionRefs.current[ingredientType.value] = node;
            }}
          >
            <h2 className="text text_type_main-medium mb-6">{ingredientType.title}</h2>
            <ul className={`${styles.list} pl-4 pr-4`}>
              {ingredientType.ingredients.map((ingredient) => (
                <li key={ingredient._id} className={styles.item}>
                  <IngredientCard
                    count={ingredientCounts[ingredient._id] ?? 0}
                    ingredient={ingredient}
                    onIngredientClick={handleIngredientClick}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
