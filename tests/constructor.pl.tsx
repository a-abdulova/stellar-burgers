import { test, expect } from '@playwright/test';

const bunName = 'Краторная булка N-200i';
const mainName = 'Биокотлета из марсианской Магнолии';
const orderNumber = '12345';

const setupApiMocks = async (page) => {
  await page.routeFromHAR('tests/hars/constructor.har', {
    url: '**/api/**',
    notFound: 'abort'
  });
};

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
    await expect(page.getByText(bunName)).toBeVisible();
  });

  test('should add ingredients to constructor', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: mainName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bunName} (низ)`)).toBeVisible();

    await expect(
      page.locator('.constructor-element__text').filter({ hasText: mainName })
    ).toBeVisible();
  });

  test('should open and close ingredient modal by close button', async ({
    page
  }) => {
    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByText(bunName)
      .click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByRole('heading', { name: bunName })).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();

    await page.locator('#modals button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('should close ingredient modal by overlay click', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByText(bunName)
      .click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.locator('#modals > div').last().click({ position: { x: 10, y: 10 } });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('should create order and clear constructor', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: mainName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(orderNumber)).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.locator('#modals button').click();

    await expect(page.getByText(orderNumber)).not.toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
