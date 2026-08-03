import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './app-header.module.css';

export type TPagePath = '/' | '/feed' | '/profile';

type TAppHeaderProps = {
  activePath: TPagePath;
  onNavigate: (path: TPagePath) => void;
};

type THeaderLinkProps = {
  activePath: TPagePath;
  children: (isActive: boolean) => React.ReactNode;
  className?: string;
  onNavigate: (path: TPagePath) => void;
  path: TPagePath;
};

const getLinkClassName = (isActive: boolean, extraClass = ''): string =>
  `${styles.link}${isActive ? ` ${styles.link_active}` : ''}${extraClass}`;

const HeaderLink = ({
  activePath,
  children,
  className = '',
  onNavigate,
  path,
}: THeaderLinkProps): React.JSX.Element => {
  const isActive = activePath === path;

  return (
    <a
      href={path}
      className={getLinkClassName(isActive, className)}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(path);
      }}
    >
      {children(isActive)}
    </a>
  );
};

export const AppHeader = ({
  activePath,
  onNavigate,
}: TAppHeaderProps): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <HeaderLink activePath={activePath} path="/" onNavigate={onNavigate}>
            {(isActive) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </HeaderLink>
          <HeaderLink
            activePath={activePath}
            className=" ml-10"
            path="/feed"
            onNavigate={onNavigate}
          >
            {(isActive) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </HeaderLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <HeaderLink
          activePath={activePath}
          className={` ${styles.link_position_last}`}
          path="/profile"
          onNavigate={onNavigate}
        >
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
