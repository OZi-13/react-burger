import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

const BUN_ID = 'bun-id';
const SAUCE_ID = 'sauce-id';

const dragIngredientToConstructor = async (
  page: Page,
  ingredientId: string
): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  const ingredient = page.getByTestId(`ingredient-card-${ingredientId}`);
  const constructor = page.getByTestId('burger-constructor');

  await ingredient.dispatchEvent('dragstart', { dataTransfer });
  await constructor.dispatchEvent('dragenter', { dataTransfer });
  await constructor.dispatchEvent('dragover', { dataTransfer });
  await constructor.dispatchEvent('drop', { dataTransfer });
  await ingredient.dispatchEvent('dragend', { dataTransfer });
  await dataTransfer.dispose();
};

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/constructor.har', {
      notFound: 'abort',
      url: 'https://new-stellarburgers.education-services.ru/api/**',
    });

    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  });

  test('allows a user to inspect an ingredient, build a burger and create an order', async ({
    page,
  }) => {
    await page.goto('./');

    const bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
    const sauceCard = page.getByTestId(`ingredient-card-${SAUCE_ID}`);
    const constructor = page.getByTestId('burger-constructor');
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });

    await expect(bunCard).toBeVisible();

    await bunCard.click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('ingredient-details')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('ingredient-details')).toContainText('420');

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await dragIngredientToConstructor(page, BUN_ID);
    await dragIngredientToConstructor(page, SAUCE_ID);

    await expect(constructor).toContainText('Краторная булка N-200i (верх)');
    await expect(constructor).toContainText('Краторная булка N-200i (низ)');
    await expect(constructor).toContainText('Соус Spicy-X');
    await expect(orderButton).toBeEnabled();

    await orderButton.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-details')).toContainText(
      'идентификатор заказа'
    );
    await expect(page.getByTestId('order-number')).toHaveText('424242');

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
