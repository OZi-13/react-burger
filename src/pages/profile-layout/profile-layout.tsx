import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile-layout.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link}${isActive ? ` ${styles.link_active}` : ''}`;

export const ProfileLayout = (): React.JSX.Element => {
  return (
    <main className={`${styles.layout} pl-5 pr-5`}>
      <nav className={styles.navigation}>
        <NavLink end to="/profile" className={getLinkClassName}>
          <span className="text text_type_main-medium">Профиль</span>
        </NavLink>
        <NavLink to="/profile/orders" className={getLinkClassName}>
          <span className="text text_type_main-medium">История заказов</span>
        </NavLink>
        <button className={`${styles.link} ${styles.button}`} type="button">
          <span className="text text_type_main-medium">Выход</span>
        </button>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <Outlet />
    </main>
  );
};
