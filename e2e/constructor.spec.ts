import { expect, test } from '@playwright/test';

import { BURGER_API_URL } from '../src/utils/constants';

import { ConstructorPage } from './pages/constructor-page';

const BUN_ID = 'bun-id';
const SAUCE_ID = 'sauce-id';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/constructor.har', {
      notFound: 'abort',
      url: `${BURGER_API_URL}/**`,
    });

    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  });

  test('allows a user to inspect an ingredient, build a burger and create an order', async ({
    page,
  }) => {
    const constructorPage = new ConstructorPage(page);

    await constructorPage.goto();

    await expect(constructorPage.getIngredientCard(BUN_ID)).toBeVisible();

    await constructorPage.getIngredientCard(BUN_ID).click();
    await expect(constructorPage.modal).toBeVisible();
    await expect(constructorPage.ingredientDetails).toContainText(
      'Краторная булка N-200i'
    );
    await expect(constructorPage.ingredientDetails).toContainText('420');

    await constructorPage.closeModal();
    await expect(constructorPage.modal).not.toBeVisible();

    await constructorPage.dragIngredientToConstructor(BUN_ID);
    await constructorPage.dragIngredientToConstructor(SAUCE_ID);

    await expect(constructorPage.burgerConstructor).toContainText(
      'Краторная булка N-200i (верх)'
    );
    await expect(constructorPage.burgerConstructor).toContainText(
      'Краторная булка N-200i (низ)'
    );
    await expect(constructorPage.burgerConstructor).toContainText('Соус Spicy-X');
    await expect(constructorPage.orderButton).toBeEnabled();

    await constructorPage.orderButton.click();

    await expect(constructorPage.modal).toBeVisible();
    await expect(constructorPage.orderDetails).toContainText('идентификатор заказа');
    await expect(constructorPage.orderNumber).toHaveText('424242');

    await constructorPage.closeModal();
    await expect(constructorPage.modal).not.toBeVisible();
  });
});
