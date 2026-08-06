import { expect, test, type Page } from '@playwright/test';

const contentPagination = '[data-content-pagination="true"]';
const contentSteps = `${contentPagination} [data-content-step]`;
const FOOTER_NAVIGATION_DELAY = 1550;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.locator('.minimalist-theme').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
}

async function expectContentPaginationGeometry(page: Page) {
  const geometry = await page.locator(contentPagination).evaluate((pagination) => {
    const dots = [...pagination.querySelectorAll<HTMLElement>('[data-content-step] span')];
    const first = dots[0]?.getBoundingClientRect();
    const second = dots[1]?.getBoundingClientRect();
    const group = pagination.getBoundingClientRect();
    return {
      groupWidth: group.width,
      groupHeight: group.height,
      dotWidth: first?.width,
      dotHeight: first?.height,
      gap: first && second ? second.top - first.bottom : undefined,
    };
  });
  expect(geometry.groupWidth).toBe(10);
  expect(geometry.dotWidth).toBe(10);
  expect(geometry.dotHeight).toBe(10);
  expect(geometry.gap).toBe(6);
  expect(geometry.groupHeight).toBe(4 * 10 + 3 * 6);
}

async function openMinimalist(page: Page, locale: 'en' | 'pt-BR', width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto(`/${locale}/portfolios/minimalist`, { waitUntil: 'networkidle' });
  await expect(page.locator(contentPagination)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

test.describe('Minimalist content pagination', () => {
  for (const locale of ['en', 'pt-BR'] as const) {
    test(`${locale} exposes isolated dots and matches the Figma geometry`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      await openMinimalist(page, locale, 1280, 826);

      const pagination = page.locator(contentPagination);
      await expect(pagination.locator('[data-content-step]')).toHaveCount(4);
      await expect(pagination.locator('[aria-current="step"]')).toHaveCount(1);
      await expectContentPaginationGeometry(page);
      await expect(page.locator('.minimalist__footer-option button')).toHaveCount(5);
      await page.screenshot({ path: testInfo.outputPath(`${locale}-content-pagination.png`), animations: 'disabled' });

      await pagination.locator('[data-content-step="2"]').click();
      await expect(pagination.locator('[data-content-step="2"]')).toHaveAttribute('aria-current', 'step');
      await expect(pagination.locator('[aria-current="step"]')).toHaveCount(1);
      await page.waitForTimeout(600);

      await pagination.locator('[data-content-step="3"]').focus();
      await expect(pagination.locator('[data-content-step="3"]')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(pagination.locator('[data-content-step="3"]')).toHaveAttribute('aria-current', 'step');
      await page.waitForTimeout(600);
      await pagination.locator('[data-content-step="4"]').focus();
      await page.keyboard.press('Space');
      await expect(pagination.locator('[data-content-step="4"]')).toHaveAttribute('aria-current', 'step');
      expect(consoleErrors).toEqual([]);
    });
  }

  for (const [width, height] of [
    [900, 800],
    [390, 844],
  ] as const) {
    test(`keeps the dots usable without overflow at ${width}px`, async ({ page }) => {
      await openMinimalist(page, 'en', width, height);
      const pagination = page.locator(contentPagination);
      await expect(pagination.locator('[aria-current="step"]')).toHaveCount(1);
      await expectContentPaginationGeometry(page);
      await expectNoHorizontalOverflow(page);
      await pagination.locator('[data-content-step="2"]').press('Enter');
      await expect(pagination.locator('[data-content-step="2"]')).toHaveAttribute('aria-current', 'step');
    });
  }

  test('keeps footer pagination isolated and Gamified functional', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await openMinimalist(page, 'en', 900, 800);
    const footer = page.locator('.minimalist__footer-viewport');
    await expect(footer.getByRole('button')).toHaveCount(5);
    await expect(footer.getByRole('button', { pressed: true })).toHaveCount(1);
    await page.locator(contentPagination).locator('[data-content-step="2"]').click();
    await expect(footer.getByRole('button', { pressed: true })).toHaveCount(1);
    await expectNoHorizontalOverflow(page);

    await page.goto('/en/portfolios/gamified', { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('scrolls the project list without changing the active footer section', async ({ page }) => {
    await openMinimalist(page, 'en', 390, 844);
    await page.locator(contentPagination).locator('[data-content-step="2"]').click();
    await page.waitForTimeout(600);

    const grid = page.locator('.minimalist__project-grid');
    await expect(grid).toBeVisible();
    await expect.poll(() => grid.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

    await grid.dispatchEvent('wheel', { deltaY: 200 });
    await expect.poll(() => grid.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(page.locator('.minimalist__footer-option--active button[aria-pressed="true"]')).toHaveAccessibleName(
      'Projects',
    );
  });

  test('hands off project-list boundary wheel to the global page', async ({ page }) => {
    await openMinimalist(page, 'en', 390, 844);
    await page.locator(contentPagination).locator('[data-content-step="2"]').click();
    await page.waitForTimeout(600);

    const grid = page.locator('.minimalist__project-grid');
    const activeFooterOption = page.locator('.minimalist__footer-option--active button[aria-pressed="true"]');
    await grid.evaluate((element) => {
      element.scrollTop = element.scrollHeight - element.clientHeight;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await page.waitForTimeout(50);
    await grid.dispatchEvent('wheel', { deltaY: 60 });
    await expect(activeFooterOption).toHaveAccessibleName('Projects');
    await grid.dispatchEvent('wheel', { deltaY: 60 });
    await expect(activeFooterOption).toHaveAccessibleName('Experiences');

    await page.locator(contentPagination).locator('[data-content-step="2"]').click();
    await page.waitForTimeout(600);
    await page.waitForTimeout(FOOTER_NAVIGATION_DELAY);
    await grid.evaluate((element) => {
      element.scrollTop = 0;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await page.waitForTimeout(50);
    await grid.dispatchEvent('wheel', { deltaY: -60 });
    await expect(activeFooterOption).toHaveAccessibleName('Projects');
    await grid.dispatchEvent('wheel', { deltaY: -60 });
    await expect(activeFooterOption).toHaveAccessibleName('About');
  });

  test('matches light and dark step tokens and preserves focus visibility', async ({ page }) => {
    await openMinimalist(page, 'en', 900, 800);
    const regularStep = page.locator('[data-content-step="2"] .minimalist-step');
    await expect(regularStep).toHaveCSS('background-color', 'rgb(255, 250, 229)');
    await expect(regularStep).toHaveCSS('border-top-color', 'rgb(0, 0, 0)');
    await page.getByRole('button', { name: 'Dark' }).click();
    await expect(page.locator('.minimalist-theme')).toHaveClass(/minimalist-theme--dark/);
    await expect(regularStep).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(regularStep).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
    await page.locator('[data-content-step="2"]').focus();
    await expect(page.locator('[data-content-step="2"]')).toBeFocused();
  });
});
