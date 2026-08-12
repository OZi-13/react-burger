import type { Locator, Page } from '@playwright/test';

export class ConstructorPage {
  readonly burgerConstructor: Locator;
  readonly ingredientDetails: Locator;
  readonly modal: Locator;
  readonly modalCloseButton: Locator;
  readonly orderButton: Locator;
  readonly orderDetails: Locator;
  readonly orderNumber: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.burgerConstructor = page.getByTestId('burger-constructor');
    this.ingredientDetails = page.getByTestId('ingredient-details');
    this.modal = page.getByTestId('modal');
    this.modalCloseButton = page.getByTestId('modal-close');
    this.orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.orderDetails = page.getByTestId('order-details');
    this.orderNumber = page.getByTestId('order-number');
  }

  getIngredientCard(ingredientId: string): Locator {
    return this.page.getByTestId(`ingredient-card-${ingredientId}`);
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
  }

  async closeModal(): Promise<void> {
    await this.modalCloseButton.click();
  }

  async dragIngredientToConstructor(ingredientId: string): Promise<void> {
    const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());
    const ingredient = this.getIngredientCard(ingredientId);

    await ingredient.dispatchEvent('dragstart', { dataTransfer });
    await this.burgerConstructor.dispatchEvent('dragenter', { dataTransfer });
    await this.burgerConstructor.dispatchEvent('dragover', { dataTransfer });
    await this.burgerConstructor.dispatchEvent('drop', { dataTransfer });
    await ingredient.dispatchEvent('dragend', { dataTransfer });
    await dataTransfer.dispose();
  }
}
