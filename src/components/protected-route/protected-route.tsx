import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUser } from '../../services/selectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return component;
};
