import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { FeedPage } from '@pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { HomePage } from '@pages/home-page/home-page';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { ProfileLayout } from '@pages/profile-layout/profile-layout';
import { ProfileOrdersPage } from '@pages/profile-orders-page/profile-orders-page';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';
import {
  clearCurrentIngredient,
  selectCurrentIngredient,
} from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';
import { fetchIngredients } from '@services/ingredients/ingredients-thunks';
import {
  clearOrder,
  selectOrderError,
  selectOrderIsLoading,
  selectOrderNumber,
} from '@services/order/order-slice';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TModalLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as TModalLocationState | null;
  const background = locationState?.background;
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const orderNumber = useAppSelector(selectOrderNumber);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const orderError = useAppSelector(selectOrderError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleOrderClick = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseIngredientModal = useCallback((): void => {
    dispatch(clearCurrentIngredient());
    void navigate(-1);
  }, [dispatch, navigate]);

  const handleCloseOrderModal = useCallback((): void => {
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route
          path="/"
          element={
            <HomePage
              error={error}
              isLoading={isLoading}
              onOrderClick={handleOrderClick}
            />
          }
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {background && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails
            error={orderError}
            isLoading={isOrderLoading}
            orderNumber={orderNumber}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
