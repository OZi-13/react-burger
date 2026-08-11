import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

const NUTRITION = [
  { key: 'calories', title: 'Калории,ккал' },
  { key: 'proteins', title: 'Белки, г' },
  { key: 'fat', title: 'Жиры, г' },
  { key: 'carbohydrates', title: 'Углеводы, г' },
] as const;

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <article className={`${styles.details} pb-15`} data-testid="ingredient-details">
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>
      <ul className={styles.nutrition}>
        {NUTRITION.map((item) => (
          <li key={item.key} className={styles.nutrition_item}>
            <span className="text text_type_main-default text_color_inactive mb-2">
              {item.title}
            </span>
            <span className="text text_type_digits-default text_color_inactive">
              {ingredient[item.key]}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};
