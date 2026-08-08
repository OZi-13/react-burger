const PASSWORD_RESET_REQUEST_KEY = 'passwordResetRequest';

export const setPasswordResetRequest = (): void => {
  localStorage.setItem(PASSWORD_RESET_REQUEST_KEY, 'true');
};

export const clearPasswordResetRequest = (): void => {
  localStorage.removeItem(PASSWORD_RESET_REQUEST_KEY);
};

export const hasPasswordResetRequest = (): boolean => {
  return localStorage.getItem(PASSWORD_RESET_REQUEST_KEY) === 'true';
};
