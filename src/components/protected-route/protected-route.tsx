import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/auth/auth-slice';
import { useAppSelector } from '@services/hooks';
import { hasPasswordResetRequest } from '@utils/password-reset';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
  requirePasswordResetRequest?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  requirePasswordResetRequest = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (requirePasswordResetRequest && !hasPasswordResetRequest()) {
    return <Navigate replace to="/forgot-password" />;
  }

  if (onlyUnAuth && user) {
    const locationState = location.state as TLocationState | null;

    return <Navigate replace to={locationState?.from?.pathname ?? '/'} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};
