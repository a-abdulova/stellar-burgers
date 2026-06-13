import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrderByNumber,
  selectIngredients,
  selectProfileOrderByNumber
} from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { number } = useParams();

  const orderNumber = Number(number);
  const isProfileOrderRoute = location.pathname.startsWith('/profile/orders');

  const feedOrderData = useSelector(selectFeedOrderByNumber(orderNumber));
  const profileOrderData = useSelector(selectProfileOrderByNumber(orderNumber));
  const orderData = isProfileOrderRoute ? profileOrderData : feedOrderData;

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData && !Number.isNaN(orderNumber)) {
      if (isProfileOrderRoute) {
        dispatch(fetchProfileOrders());
      } else {
        dispatch(fetchFeeds());
      }
    }
  }, [dispatch, orderData, orderNumber, isProfileOrderRoute]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
