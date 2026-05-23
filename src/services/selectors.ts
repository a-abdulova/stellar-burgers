import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id);

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedInfo = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export const selectFeedOrderByNumber = (number: number) => (state: RootState) =>
  state.feed.orders.find((order) => order.number === number);

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.user.isLoading;
export const selectAuthError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
export const selectProfileOrderByNumber =
  (number: number) => (state: RootState) =>
    state.profileOrders.orders.find((order) => order.number === number);
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderError = (state: RootState) => state.order.error;
