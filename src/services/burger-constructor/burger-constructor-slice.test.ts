import {
  bunIngredient,
  constructorMain,
  constructorSauce,
  mainIngredient,
  sauceIngredient,
} from '@utils/test-fixtures';

import {
  addConstructorIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveConstructorIngredient,
  removeConstructorIngredient,
  selectConstructorTotalPrice,
  selectIngredientCounts,
} from './burger-constructor-slice';

describe('burgerConstructorSlice', () => {
  it('returns the initial state', () => {
    const result = burgerConstructorSlice.reducer(undefined, { type: '' });

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('adds a bun to constructor state', () => {
    const result = burgerConstructorSlice.reducer(
      undefined,
      addConstructorIngredient(bunIngredient)
    );

    expect(result.bun?._id).toBe(bunIngredient._id);
    expect('constructorId' in (result.bun ?? {})).toBe(true);
    expect(result.ingredients).toEqual([]);
  });

  it('replaces a bun when another bun is added', () => {
    const startState = {
      bun: bunIngredient,
      ingredients: [],
    };
    const nextBun = {
      ...bunIngredient,
      _id: 'next-bun-id',
      name: 'Флюоресцентная булка',
    };
    const result = burgerConstructorSlice.reducer(
      startState,
      addConstructorIngredient(nextBun)
    );

    expect(result.bun).toEqual(
      expect.objectContaining({
        _id: nextBun._id,
        name: nextBun.name,
      })
    );
    expect(result.ingredients).toEqual([]);
  });

  it('adds a filling ingredient to constructor state', () => {
    const result = burgerConstructorSlice.reducer(
      undefined,
      addConstructorIngredient(mainIngredient)
    );

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]?._id).toBe(mainIngredient._id);
    expect(typeof result.ingredients[0]?.constructorId).toBe('string');
  });

  it('removes a filling ingredient by constructor id', () => {
    const result = burgerConstructorSlice.reducer(
      {
        bun: bunIngredient,
        ingredients: [constructorSauce, constructorMain],
      },
      removeConstructorIngredient(constructorSauce.constructorId)
    );

    expect(result.ingredients).toEqual([constructorMain]);
  });

  it('moves filling ingredients inside constructor state', () => {
    const result = burgerConstructorSlice.reducer(
      {
        bun: bunIngredient,
        ingredients: [constructorSauce, constructorMain],
      },
      moveConstructorIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(result.ingredients).toEqual([constructorMain, constructorSauce]);
  });

  it('does not change ingredients when dragged item is missing', () => {
    const result = burgerConstructorSlice.reducer(
      {
        bun: bunIngredient,
        ingredients: [constructorSauce],
      },
      moveConstructorIngredient({ dragIndex: 5, hoverIndex: 0 })
    );

    expect(result.ingredients).toEqual([constructorSauce]);
  });

  it('clears constructor state', () => {
    const result = burgerConstructorSlice.reducer(
      {
        bun: bunIngredient,
        ingredients: [constructorSauce, constructorMain],
      },
      clearConstructor()
    );

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('calculates ingredient counts', () => {
    const result = selectIngredientCounts({
      burgerConstructor: {
        bun: bunIngredient,
        ingredients: [
          constructorSauce,
          { ...constructorSauce, constructorId: 'second' },
        ],
      },
    });

    expect(result).toEqual({
      [bunIngredient._id]: 2,
      [sauceIngredient._id]: 2,
    });
  });

  it('calculates constructor total price', () => {
    const result = selectConstructorTotalPrice({
      burgerConstructor: {
        bun: bunIngredient,
        ingredients: [constructorSauce, constructorMain],
      },
    });

    expect(result).toBe(
      bunIngredient.price * 2 + sauceIngredient.price + mainIngredient.price
    );
  });
});
