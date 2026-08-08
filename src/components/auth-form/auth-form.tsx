import { Button } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import styles from './auth-form.module.css';

type TAuthFormAction = {
  linkText: string;
  text: string;
  to: string;
};

type TAuthFormProps = {
  actions?: TAuthFormAction[];
  buttonText: string;
  children: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
};

export const AuthForm = ({
  actions = [],
  buttonText,
  children,
  error = '',
  isLoading = false,
  onSubmit,
  title,
}: TAuthFormProps): React.JSX.Element => {
  return (
    <main className={`${styles.page} pl-5 pr-5`}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium mb-6">{title}</h1>
        <div className={styles.fields}>{children}</div>
        {error && (
          <p className="text text_type_main-default text_color_error">{error}</p>
        )}
        <Button htmlType="submit" disabled={isLoading} size="medium" type="primary">
          {isLoading ? 'Загрузка...' : buttonText}
        </Button>
      </form>
      {actions.length > 0 && (
        <div className={`${styles.actions} mt-20`}>
          {actions.map((action) => (
            <p
              key={`${action.text}-${action.to}`}
              className="text text_type_main-default text_color_inactive"
            >
              {action.text}{' '}
              <Link className={styles.link} to={action.to}>
                {action.linkText}
              </Link>
            </p>
          ))}
        </div>
      )}
    </main>
  );
};
