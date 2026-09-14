import { expect, test } from '@playwright/test';

test('keeps a collapsed card focused while another card is hovered', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 826 });
  await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
  await page.locator('[data-content-step="2"]').click();
  await page.waitForTimeout(1100);

  const cards = page.locator('[data-project-card]');
  const firstCard = cards.nth(0);
  const secondCard = cards.nth(1);
  const expandControl = firstCard.locator('.minimalist-card__expand-control');

  await expandControl.click();
  await firstCard.locator('.minimalist-card__expand-control').click();
  await expect(expandControl).toBeFocused();

  await secondCard.hover();
  await expect(expandControl).toBeFocused();
  await expect.poll(() => firstCard.locator('article').evaluate((card) => getComputedStyle(card).opacity)).toBe('1');
  await expect.poll(() => secondCard.locator('article').evaluate((card) => getComputedStyle(card).opacity)).toBe('1');
});
