import { user } from '@utils/test-fixtures';

import { authSlice, setAuthChecked, setUser } from './auth-slice';
import {
  checkUserAuthThunk,
  forgotPasswordThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  resetPasswordThunk,
  updateUserThunk,
} from './auth-thunks';

const authRequest = {
  email: 'user@example.com',
  password: 'password',
};

describe('authSlice', () => {
  it('returns the initial state', () => {
    const result = authSlice.reducer(undefined, { type: '' });

    expect(result).toEqual({
      error: '',
      isAuthChecked: false,
      isLoading: false,
      user: null,
    });
  });

  it('sets auth checked flag', () => {
    const result = authSlice.reducer(undefined, setAuthChecked(true));

    expect(result.isAuthChecked).toBe(true);
  });

  it('sets user', () => {
    const result = authSlice.reducer(undefined, setUser(user));

    expect(result.user).toEqual(user);
  });

  it('handles successful register request', () => {
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      registerThunk.fulfilled(user, 'request-id', { ...authRequest, name: user.name })
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: true,
      isLoading: false,
      user,
    });
  });

  it('handles successful login request', () => {
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      loginThunk.fulfilled(user, 'request-id', authRequest)
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: true,
      isLoading: false,
      user,
    });
  });

  it('handles successful logout request', () => {
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: true,
        isLoading: true,
        user,
      },
      logoutThunk.fulfilled(undefined, 'request-id')
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: true,
      isLoading: false,
      user: null,
    });
  });

  it('handles successful user update request', () => {
    const updatedUser = {
      ...user,
      name: 'Updated User',
    };
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: true,
        isLoading: true,
        user,
      },
      updateUserThunk.fulfilled(updatedUser, 'request-id', { name: updatedUser.name })
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: true,
      isLoading: false,
      user: updatedUser,
    });
  });

  it('handles successful auth check request', () => {
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      checkUserAuthThunk.fulfilled(user, 'request-id')
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: true,
      isLoading: false,
      user,
    });
  });

  it('handles successful password requests', () => {
    const forgotResult = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      forgotPasswordThunk.fulfilled(undefined, 'request-id', {
        email: user.email,
      })
    );
    const resetResult = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      resetPasswordThunk.fulfilled(undefined, 'request-id', {
        password: 'password',
        token: 'reset-token',
      })
    );

    expect(forgotResult).toMatchObject({
      error: '',
      isLoading: false,
    });
    expect(resetResult).toMatchObject({
      error: '',
      isLoading: false,
    });
  });

  it('sets loading state for pending auth requests', () => {
    const result = authSlice.reducer(
      {
        error: 'Error',
        isAuthChecked: false,
        isLoading: false,
        user: null,
      },
      loginThunk.pending('request-id', authRequest)
    );

    expect(result).toEqual({
      error: '',
      isAuthChecked: false,
      isLoading: true,
      user: null,
    });
  });

  it('stores rejected request error message', () => {
    const result = authSlice.reducer(
      {
        error: '',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      loginThunk.rejected(
        new Error('Неверный email или пароль'),
        'request-id',
        authRequest
      )
    );

    expect(result).toEqual({
      error: 'Неверный email или пароль',
      isAuthChecked: false,
      isLoading: false,
      user: null,
    });
  });

  it('stores fallback error message when rejected request has no message', () => {
    const result = authSlice.reducer(
      {
        error: '',
        isAuthChecked: false,
        isLoading: true,
        user: null,
      },
      {
        error: {},
        type: loginThunk.rejected.type,
      }
    );

    expect(result.error).toBe('Не удалось выполнить запрос. Попробуйте ещё раз.');
    expect(result.isLoading).toBe(false);
  });
});
