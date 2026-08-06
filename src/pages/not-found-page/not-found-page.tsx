import { Link } from 'react-router-dom';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className={`${styles.page} pl-5 pr-5`}>
      <h1 className="text text_type_main-large mb-6">Страница не найдена</h1>
      <Link className={`${styles.link} text text_type_main-default`} to="/">
        Вернуться к конструктору
      </Link>
    </main>
  );
};
