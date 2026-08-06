import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { selectAuthError, selectIsAuthLoading } from '@services/auth/auth-slice';
import { registerThunk } from '@services/auth/auth-thunks';
import { useAppDispatch, useAppSelector } from '@services/hooks';

type TRegisterForm = {
  email: string;
  name: string;
  password: string;
};

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const [form, setForm] = useState<TRegisterForm>({
    email: '',
    name: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(registerThunk(form))
      .unwrap()
      .then(() => {
        void navigate('/', { replace: true });
      });
  };

  return (
    <AuthForm
      actions={[
        {
          linkText: 'Войти',
          text: 'Уже зарегистрированы?',
          to: '/login',
        },
      ]}
      buttonText="Зарегистрироваться"
      error={error}
      isLoading={isLoading}
      title="Регистрация"
      onSubmit={handleSubmit}
    >
      <Input
        name="name"
        placeholder="Имя"
        type="text"
        value={form.name}
        onChange={handleChange}
      />
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
