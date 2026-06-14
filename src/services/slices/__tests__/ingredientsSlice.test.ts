import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';

const ingredientsMock = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image',
    image_mobile: 'image-mobile',
    image_large: 'image-large'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'image',
    image_mobile: 'image-mobile',
    image_large: 'image-large'
  }
];

describe('ingredientsSlice reducer', () => {
  test('should return initial state with unknown action', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  test('should set loading true on fetchIngredients.pending', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.items).toEqual([]);
  });

  test('should set ingredients on fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(ingredientsMock, '')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(ingredientsMock);
  });

  test('should set error on fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), '')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.items).toEqual([]);
  });
});
