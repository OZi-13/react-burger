import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

type THeaderLinkProps = {
  children: (isActive: boolean) => React.ReactNode;
  className?: string;
  end?: boolean;
  to: string;
};

const getLinkClassName = (isActive: boolean, extraClass = ''): string =>
  `${styles.link}${isActive ? ` ${styles.link_active}` : ''}${extraClass}`;

const HeaderLink = ({
  children,
  className = '',
  end = false,
  to,
}: THeaderLinkProps): React.JSX.Element => {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) => getLinkClassName(isActive, className)}
    >
      {({ isActive }) => children(isActive)}
    </NavLink>
  );
};

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <HeaderLink end to="/">
            {(isActive) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </HeaderLink>
          <HeaderLink className=" ml-10" to="/feed">
            {(isActive) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </HeaderLink>
        </div>
        <Link className={styles.logo} to="/" aria-label="На главную">
          <Logo />
        </Link>
        <HeaderLink className={` ${styles.link_position_last}`} to="/profile">
          {(isActive) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </HeaderLink>
      </nav>
    </header>
  );
};
