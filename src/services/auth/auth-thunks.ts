import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
} from '@utils/api';
import { clearAuthTokens, hasAuthTokens } from '@utils/tokens';

import type {
  TAuthRequest,
  TForgotPasswordRequest,
  TRegisterRequest,
  TResetPasswordRequest,
  TUpdateUserRequest,
} from '@utils/types';

export const registerThunk = createAsyncThunk('auth/register', register);

export const loginThunk = createAsyncThunk('auth/login', login);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await logout();
  } catch {
    clearAuthTokens();
  }
});

export const updateUserThunk = createAsyncThunk('auth/updateUser', updateUser);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  forgotPassword
);

export const resetPasswordThunk = createAsyncThunk('auth/resetPassword', resetPassword);

export const checkUserAuthThunk = createAsyncThunk('auth/checkUserAuth', async () => {
  try {
    if (hasAuthTokens()) {
      return await getUser();
    }
  } catch {
    clearAuthTokens();
  }

  return null;
});

export type {
  TAuthRequest,
  TForgotPasswordRequest,
  TRegisterRequest,
  TResetPasswordRequest,
  TUpdateUserRequest,
};
