import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { selectAuthError, selectIsAuthLoading } from '@services/auth/auth-slice';
import { forgotPasswordThunk } from '@services/auth/auth-thunks';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { setPasswordResetRequest } from '@utils/password-reset';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(forgotPasswordThunk({ email }))
      .unwrap()
      .then(() => {
        setPasswordResetRequest();
        void navigate('/reset-password');
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
      buttonText="Восстановить"
      error={error}
      isLoading={isLoading}
      title="Восстановление пароля"
      onSubmit={handleSubmit}
    >
      <EmailInput
        isIcon={false}
        name="email"
        placeholder="Укажите e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
    </AuthForm>
  );
};
