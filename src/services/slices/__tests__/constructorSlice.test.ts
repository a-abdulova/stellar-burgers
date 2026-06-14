import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';

const bunMock = {
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
};

const mainMock = {
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
};

const sauceMock = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'image',
  image_mobile: 'image-mobile',
  image_large: 'image-large'
};

describe('constructorSlice reducer', () => {
  test('should return initial state with unknown action', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('should add bun', () => {
    const state = constructorReducer(undefined, addIngredient(bunMock));

    expect(state.bun).toEqual(bunMock);
    expect(state.ingredients).toEqual([]);
  });

  test('should replace bun', () => {
    const anotherBun = {
      ...bunMock,
      _id: 'another-bun-id',
      name: 'Флюоресцентная булка R2-D3'
    };

    const stateWithBun = constructorReducer(undefined, addIngredient(bunMock));

    const state = constructorReducer(stateWithBun, addIngredient(anotherBun));

    expect(state.bun).toEqual(anotherBun);
    expect(state.ingredients).toEqual([]);
  });

  test('should add ingredient with generated id', () => {
    const state = constructorReducer(undefined, addIngredient(mainMock));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mainMock,
      id: expect.any(String)
    });
  });

  test('should remove ingredient by id', () => {
    const stateWithIngredient = constructorReducer(
      undefined,
      addIngredient(mainMock)
    );

    const ingredientId = stateWithIngredient.ingredients[0].id;

    const state = constructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toEqual([]);
  });

  test('should move ingredient', () => {
    const stateWithFirstIngredient = constructorReducer(
      undefined,
      addIngredient(mainMock)
    );

    const stateWithTwoIngredients = constructorReducer(
      stateWithFirstIngredient,
      addIngredient(sauceMock)
    );

    const state = constructorReducer(
      stateWithTwoIngredients,
      moveIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state.ingredients[0]._id).toBe(sauceMock._id);
    expect(state.ingredients[1]._id).toBe(mainMock._id);
  });

  test('should clear constructor', () => {
    const stateWithBun = constructorReducer(undefined, addIngredient(bunMock));

    const stateWithIngredient = constructorReducer(
      stateWithBun,
      addIngredient(mainMock)
    );

    const state = constructorReducer(stateWithIngredient, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
