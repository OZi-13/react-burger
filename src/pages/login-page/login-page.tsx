import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { useForm } from '@hooks/use-form';
import { selectAuthError, selectIsAuthLoading } from '@services/auth/auth-slice';
import { loginThunk } from '@services/auth/auth-thunks';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { Location } from 'react-router-dom';

type TLoginForm = {
  email: string;
  password: string;
};

type TLocationState = {
  from?: Location;
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const { handleChange, values: form } = useForm<TLoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const locationState = location.state as TLocationState | null;
    const redirectPath = locationState?.from
      ? `${locationState.from.pathname}${locationState.from.search}${locationState.from.hash}`
      : '/';

    void dispatch(loginThunk(form))
      .unwrap()
      .then(() => {
        void navigate(redirectPath, { replace: true });
      });
  };

  return (
    <AuthForm
      actions={[
        {
          linkText: 'Зарегистрироваться',
          text: 'Вы - новый пользователь?',
          to: '/register',
        },
        {
          linkText: 'Восстановить пароль',
          text: 'Забыли пароль?',
          to: '/forgot-password',
        },
      ]}
      buttonText="Войти"
      error={error}
      isLoading={isLoading}
      title="Вход"
      onSubmit={handleSubmit}
    >
      <EmailInput
        isIcon={false}
        name="email"
        placeholder="E-mail"
        value={form.email}
        onChange={handleChange}
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
      />
    </AuthForm>
  );
};
