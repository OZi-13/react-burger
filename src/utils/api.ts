import { BURGER_API_URL } from '@utils/constants';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from '@utils/tokens';

import type {
  TAuthRequest,
  TAuthResponse,
  TBaseResponse,
  TCreateOrderRequest,
  TCreateOrderResponse,
  TForgotPasswordRequest,
  TIngredientsResponse,
  TIngredient,
  TMessageResponse,
  TRefreshTokenResponse,
  TRegisterRequest,
  TResetPasswordRequest,
  TUpdateUserRequest,
  TUser,
  TUserResponse,
} from '@utils/types';

type TRequestOptions = RequestInit & {
  headers?: HeadersInit;
};

class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

const checkResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T & { message?: string };

  if (response.ok) {
    return data;
  }

  throw new ServerError(
    data.message ?? `Ошибка запроса: ${response.status}`,
    response.status
  );
};

const checkSuccess = <T extends TBaseResponse>(response: T): T => {
  if (!response.success) {
    throw new Error('API вернул неуспешный ответ');
  }

  return response;
};

const request = <T>(endpoint: string, options: TRequestOptions = {}): Promise<T> => {
  return fetch(`${BURGER_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }).then((response) => checkResponse<T>(response));
};

const refreshAuthToken = (): Promise<TRefreshTokenResponse> => {
  const refreshToken = getRefreshToken();

  return request<TRefreshTokenResponse>('/auth/token', {
    body: JSON.stringify({ token: refreshToken }),
    method: 'POST',
  }).then((response) => {
    const checkedResponse = checkSuccess(response);

    saveAuthTokens(checkedResponse);

    return checkedResponse;
  });
};

const fetchWithRefresh = async <T>(
  endpoint: string,
  options: TRequestOptions = {}
): Promise<T> => {
  const accessToken = getAccessToken();

  try {
    return await request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...(accessToken ? { authorization: accessToken } : {}),
      },
    });
  } catch (error) {
    if (
      error instanceof ServerError &&
      (error.statusCode === 401 || error.statusCode === 403) &&
      getRefreshToken()
    ) {
      const refreshData = await refreshAuthToken();

      return request<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken,
        },
      });
    }

    throw error;
  }
};

let ingredientsRequest: Promise<TIngredient[]> | null = null;

export const getIngredients = (): Promise<TIngredient[]> => {
  ingredientsRequest ??= request<TIngredientsResponse>('/ingredients')
    .then((response) => {
      return checkSuccess(response).data;
    })
    .catch((error: unknown) => {
      ingredientsRequest = null;

      if (error instanceof Error) {
        return Promise.reject(error);
      }

      return Promise.reject(new Error('Неизвестная ошибка запроса'));
    });

  return ingredientsRequest;
};

export const createOrder = (
  ingredients: TCreateOrderRequest['ingredients']
): Promise<number> => {
  return fetchWithRefresh<TCreateOrderResponse>('/orders', {
    body: JSON.stringify({ ingredients }),
    method: 'POST',
  })
    .then((response) => {
      return checkSuccess(response).order.number;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) {
        return Promise.reject(error);
      }

      return Promise.reject(new Error('Неизвестная ошибка запроса'));
    });
};

export const register = (data: TRegisterRequest): Promise<TUser> => {
  return request<TAuthResponse>('/auth/register', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => {
    const checkedResponse = checkSuccess(response);

    saveAuthTokens(checkedResponse);

    return checkedResponse.user;
  });
};

export const login = (data: TAuthRequest): Promise<TUser> => {
  return request<TAuthResponse>('/auth/login', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => {
    const checkedResponse = checkSuccess(response);

    saveAuthTokens(checkedResponse);

    return checkedResponse.user;
  });
};

export const logout = (): Promise<void> => {
  return request<TMessageResponse>('/auth/logout', {
    body: JSON.stringify({ token: getRefreshToken() }),
    method: 'POST',
  }).then((response) => {
    checkSuccess(response);
    clearAuthTokens();
  });
};

export const getUser = (): Promise<TUser> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'GET',
  }).then((response) => checkSuccess(response).user);
};

export const updateUser = (data: TUpdateUserRequest): Promise<TUser> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    body: JSON.stringify(data),
    method: 'PATCH',
  }).then((response) => checkSuccess(response).user);
};

export const forgotPassword = (data: TForgotPasswordRequest): Promise<void> => {
  return request<TMessageResponse>('/password-reset', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => {
    checkSuccess(response);
  });
};

export const resetPassword = (data: TResetPasswordRequest): Promise<void> => {
  return request<TMessageResponse>('/password-reset/reset', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => {
    checkSuccess(response);
  });
};
