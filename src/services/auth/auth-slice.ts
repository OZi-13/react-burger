import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  checkUserAuthThunk,
  forgotPasswordThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  resetPasswordThunk,
  updateUserThunk,
} from './auth-thunks';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '@utils/types';

type TAuthState = {
  error: string;
  isAuthChecked: boolean;
  isLoading: boolean;
  user: TUser | null;
};

export const initialState: TAuthState = {
  error: '',
  isAuthChecked: false,
  isLoading: false,
  user: null,
};

const getErrorMessage = (message?: string): string => {
  return message ?? 'Не удалось выполнить запрос. Попробуйте ещё раз.';
};

export const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.error = '';
        state.isAuthChecked = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.error = '';
        state.isAuthChecked = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.error = '';
        state.isAuthChecked = true;
        state.isLoading = false;
        state.user = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.error = '';
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state, action) => {
        state.error = '';
        state.isAuthChecked = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.error = '';
        state.isLoading = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          registerThunk.pending,
          loginThunk.pending,
          logoutThunk.pending,
          updateUserThunk.pending,
          forgotPasswordThunk.pending,
          resetPasswordThunk.pending,
          checkUserAuthThunk.pending
        ),
        (state) => {
          state.error = '';
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          registerThunk.rejected,
          loginThunk.rejected,
          logoutThunk.rejected,
          updateUserThunk.rejected,
          forgotPasswordThunk.rejected,
          resetPasswordThunk.rejected,
          checkUserAuthThunk.rejected
        ),
        (state, action) => {
          state.error = getErrorMessage(action.error.message);
          state.isLoading = false;
        }
      );
  },
  initialState,
  name: 'auth',
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
  },
  selectors: {
    selectAuthError: (state) => state.error,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthLoading: (state) => state.isLoading,
    selectUser: (state) => state.user,
  },
});

export const { setAuthChecked, setUser } = authSlice.actions;
export const { selectAuthError, selectIsAuthChecked, selectIsAuthLoading, selectUser } =
  authSlice.selectors;
