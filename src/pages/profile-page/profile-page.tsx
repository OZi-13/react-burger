import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';

import { useForm } from '@hooks/use-form';
import {
  selectAuthError,
  selectIsAuthLoading,
  selectUser,
} from '@services/auth/auth-slice';
import { updateUserThunk } from '@services/auth/auth-thunks';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { TUpdateUserRequest } from '@utils/types';

import styles from './profile-page.module.css';

type TProfileForm = {
  email: string;
  name: string;
  password: string;
};

const EMPTY_PROFILE_FORM: TProfileForm = {
  email: '',
  name: '',
  password: '',
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const {
    handleChange,
    setValues: setForm,
    values: form,
  } = useForm<TProfileForm>(EMPTY_PROFILE_FORM);

  const initialForm = useMemo<TProfileForm>(
    () => ({
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: '',
    }),
    [user]
  );

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const isChanged = useMemo(() => {
    return (
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.password !== initialForm.password
    );
  }, [form, initialForm]);

  const handleCancel = (): void => {
    setForm(initialForm);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const updateData: TUpdateUserRequest = {};

    if (form.name !== initialForm.name) {
      updateData.name = form.name;
    }

    if (form.email !== initialForm.email) {
      updateData.email = form.email;
    }

    if (form.password) {
      updateData.password = form.password;
    }

    void dispatch(updateUserThunk(updateData));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        icon="EditIcon"
        name="name"
        placeholder="Имя"
        type="text"
        value={form.name}
        onChange={handleChange}
      />
      <EmailInput
        isIcon
        name="email"
        placeholder="Логин"
        value={form.email}
        onChange={handleChange}
      />
      <PasswordInput
        icon="EditIcon"
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
      />
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
      {isChanged && (
        <div className={`${styles.actions} mt-6`}>
          <Button
            htmlType="button"
            size="medium"
            type="secondary"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button htmlType="submit" disabled={isLoading} size="medium" type="primary">
            {isLoading ? 'Загрузка...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};
