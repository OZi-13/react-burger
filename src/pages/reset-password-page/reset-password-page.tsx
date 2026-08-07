import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { useForm } from '@hooks/use-form';
import { selectAuthError, selectIsAuthLoading } from '@services/auth/auth-slice';
import { resetPasswordThunk } from '@services/auth/auth-thunks';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearPasswordResetRequest } from '@utils/password-reset';

type TResetPasswordForm = {
  password: string;
  token: string;
};

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const { handleChange, values: form } = useForm<TResetPasswordForm>({
    password: '',
    token: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(resetPasswordThunk(form))
      .unwrap()
      .then(() => {
        clearPasswordResetRequest();
        void navigate('/login', { replace: true });
      });
  };

  return (
    <AuthForm
      actions={[
        {
          linkText: 'Войти',
          text: 'Вспомнили пароль?',
          to: '/login',
        },
      ]}
      buttonText="Сохранить"
      error={error}
      isLoading={isLoading}
      title="Восстановление пароля"
      onSubmit={handleSubmit}
    >
      <PasswordInput
        name="password"
        placeholder="Введите новый пароль"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        name="token"
        placeholder="Введите код из письма"
        type="text"
        value={form.token}
        onChange={handleChange}
      />
    </AuthForm>
  );
};
