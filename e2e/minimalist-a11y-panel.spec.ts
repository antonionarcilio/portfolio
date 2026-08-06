import { expect, test } from '@playwright/test';

test.describe('Minimalist accessibility panel', () => {
  for (const locale of ['en', 'pt-BR'] as const) {
    test(`${locale} opens, localizes, toggles and restores focus`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 826 });
      await page.goto(`/${locale}/portfolios/minimalist`, { waitUntil: 'networkidle' });

      const trigger = page.getByRole('button', {
        name: locale === 'en' ? 'Open accessibility modes' : 'Abrir modos de acessibilidade',
        exact: true,
      });
      await trigger.click();
      await expect(page.getByRole('complementary')).toBeVisible();
      await expect(page.getByRole('listbox')).toBeFocused();
      await expect(
        page.getByRole('heading', { name: locale === 'en' ? '// Enlarged Cursor' : '// Cursor Ampliado' }),
      ).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath(`${locale}-a11y-panel.png`), animations: 'disabled' });
      await expect(
        page.getByRole('button', {
          name: locale === 'en' ? 'Enable accessibility option' : 'Ativar opção de acessibilidade',
          exact: true,
        }),
      ).toHaveAttribute('aria-pressed', 'false');

      await page
        .getByRole('button', {
          name: locale === 'en' ? 'Enable accessibility option' : 'Ativar opção de acessibilidade',
          exact: true,
        })
        .click();
      await expect(
        page.getByRole('button', {
          name: locale === 'en' ? 'Enable accessibility option' : 'Ativar opção de acessibilidade',
          exact: true,
        }),
      ).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('html')).toHaveClass(/a11y-cursor-large/);

      await page.getByRole('listbox').dispatchEvent('wheel', { deltaY: 20 });
      await expect(
        page.getByRole('heading', { name: locale === 'en' ? '// Enlarged Cursor' : '// Cursor Ampliado' }),
      ).toBeVisible();
      await page.getByRole('listbox').dispatchEvent('wheel', { deltaY: 80 });
      await expect(
        page.getByRole('heading', { name: locale === 'en' ? '// Highlight Links' : '// Destacar links' }),
      ).toBeVisible();
      await page.getByRole('listbox').press('ArrowUp');
      await expect(
        page.getByRole('heading', { name: locale === 'en' ? '// Enlarged Cursor' : '// Cursor Ampliado' }),
      ).toBeVisible();

      await page
        .getByRole('button', {
          name: locale === 'en' ? 'Exit accessibility menu' : 'Sair do menu de acessibilidade',
        })
        .click();
      await expect(page.getByRole('complementary')).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  test('keeps the panel within a narrow viewport and isolated from Gamified', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'domcontentloaded' });
    await page.locator('.minimalist-a11y-trigger').click();
    await page.screenshot({ path: testInfo.outputPath('narrow-a11y-panel.png'), animations: 'disabled' });
    const dimensions = await page.locator('.minimalist-theme').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
    await page.goto('/en/portfolios/gamified', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.minimalist-a11y-panel')).toHaveCount(0);
  });
});
