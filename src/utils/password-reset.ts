const PASSWORD_RESET_REQUEST_KEY = 'passwordResetRequest';

export const setPasswordResetRequest = (): void => {
  sessionStorage.setItem(PASSWORD_RESET_REQUEST_KEY, 'true');
};

export const clearPasswordResetRequest = (): void => {
  sessionStorage.removeItem(PASSWORD_RESET_REQUEST_KEY);
};

export const hasPasswordResetRequest = (): boolean => {
  return sessionStorage.getItem(PASSWORD_RESET_REQUEST_KEY) === 'true';
};
