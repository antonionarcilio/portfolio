import { expect, test, type Page } from '@playwright/test';

const sectionLabels = ['About', 'Projects', 'Experiences', 'Education'];

async function expectFooterReady(page: Page) {
  await expect(page.locator('.minimalist__footer-track')).toHaveClass(/minimalist__footer-track--ready/);
}

async function expectCenteredActiveOption(page: Page) {
  await expect
    .poll(async () => {
      const viewport = await page.locator('.minimalist__footer-viewport').boundingBox();
      const active = await page.locator('.minimalist__footer-option--active [aria-pressed="true"]').boundingBox();
      if (!viewport || !active) return Number.POSITIVE_INFINITY;
      return Math.abs(active.x + active.width / 2 - (viewport.x + viewport.width / 2));
    })
    .toBeLessThanOrEqual(1);
}

async function expectActiveOptionFocused(page: Page) {
  await expect
    .poll(() =>
      page
        .locator('.minimalist__footer-option--active [aria-pressed="true"]')
        .evaluate((element) => element === document.activeElement),
    )
    .toBe(true);
}

async function expectActiveOptionNotFocused(page: Page) {
  await expect
    .poll(() =>
      page
        .locator('.minimalist__footer-option--active [aria-pressed="true"]')
        .evaluate((element) => element !== document.activeElement),
    )
    .toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  const { clientWidth, scrollWidth } = await page.locator('.minimalist-theme').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(scrollWidth).toBe(clientWidth);
}

async function expectFooterKeyboardWindow(page: Page) {
  const footerButtons = await page.locator('.minimalist__footer-option button').evaluateAll((buttons) =>
    buttons.map((button) => ({
      tabIndex: button.tabIndex,
    })),
  );
  expect(footerButtons.filter(({ tabIndex }) => tabIndex === 0)).toHaveLength(1);
  expect(footerButtons.filter(({ tabIndex }) => tabIndex === -1)).toHaveLength(11);
}

test.describe('Minimalist footer pagination', () => {
  for (const [locale, expectedLabels] of [
    ['en', sectionLabels],
    ['pt-BR', ['Sobre', 'Projetos', 'Experiências', 'Formação']],
  ] as const) {
    test(`${locale} keeps the active option centered and circular`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}/portfolios/minimalist`, { waitUntil: 'networkidle' });
      await expectFooterReady(page);

      const footer = page.locator('.minimalist__footer-viewport');
      await expect(footer.getByRole('button')).toHaveCount(12);
      await expect(footer.getByRole('button', { pressed: true })).toHaveCount(1);
      await expectFooterKeyboardWindow(page);
      await expectCenteredActiveOption(page);

      for (const label of expectedLabels.slice(1)) {
        await page
          .getByRole('button', { name: locale === 'en' ? 'Next page' : 'Próxima página' })
          .click({ force: true });
        await page.waitForTimeout(700);
        await expect(footer.getByRole('button', { pressed: true })).toHaveAccessibleName(label);
        await expectFooterKeyboardWindow(page);
        await expectCenteredActiveOption(page);
      }

      await page.getByRole('button', { name: locale === 'en' ? 'Next page' : 'Próxima página' }).click({ force: true });
      await page.waitForTimeout(700);
      await expect(footer.getByRole('button', { pressed: true })).toHaveAccessibleName(expectedLabels[0]);
      await expectCenteredActiveOption(page);
      await page.locator('.minimalist__main').dispatchEvent('wheel', { deltaY: 500 });
      await page.waitForTimeout(700);
      await expectCenteredActiveOption(page);
      await expectNoHorizontalOverflow(page);
      await page.screenshot({ path: testInfo.outputPath(`${locale}-footer.png`), animations: 'disabled' });
      expect(consoleErrors).toEqual([]);
    });
  }

  test('supports dark appearance and keyboard endpoint wrapping', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await expectFooterReady(page);
    await page.getByRole('button', { name: 'Dark' }).click();
    await page.waitForTimeout(700);
    await expect(page.locator('.minimalist-theme')).toHaveClass(/minimalist-theme--dark/);
    await page.getByRole('button', { name: 'Previous page' }).press('Enter');
    await page.waitForTimeout(700);
    await expect(page.locator('.minimalist__footer-option--active [aria-pressed="true"]')).toHaveAccessibleName(
      'Education',
    );
    await expectCenteredActiveOption(page);
    await expectNoHorizontalOverflow(page);
  });

  test('centers the exact footer option that was clicked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await expectFooterReady(page);

    const centralEducationOption = page
      .locator('.minimalist__footer-option button')
      .filter({ hasText: 'Education' })
      .first();
    await centralEducationOption.click({ force: true });
    await page.waitForTimeout(700);
    const activeEducationOption = page.locator('.minimalist__footer-option--active button[aria-pressed="true"]');
    await expect(activeEducationOption).toHaveAccessibleName('Education');

    await expectCenteredActiveOption(page);
    await expectActiveOptionFocused(page);
  });

  test('keeps focus when a visible loop copy is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await expectFooterReady(page);

    await page
      .locator('.minimalist__footer-option button')
      .filter({ hasText: 'Projects' })
      .first()
      .dispatchEvent('click');
    await page.waitForTimeout(700);

    const activeEducationOption = page.locator('.minimalist__footer-option--active button[aria-pressed="true"]');
    await expect(activeEducationOption).toHaveAccessibleName('Projects');
    await expectCenteredActiveOption(page);
    await expectActiveOptionFocused(page);
  });

  test('keeps logical focus synchronized through repeated arrow navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await expectFooterReady(page);

    await page.locator('.minimalist__footer-option--active [aria-pressed="true"]').focus();
    const keys = ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowLeft'];
    for (let index = 0; index < 16; index += 1) {
      await page.keyboard.press(keys[index % keys.length]);
      await page.waitForTimeout(700);
      await expectCenteredActiveOption(page);
      await expectActiveOptionFocused(page);
      await expectFooterKeyboardWindow(page);
      await expect(page.locator('.minimalist__footer-option--active [aria-pressed="true"]')).toHaveCount(1);
    }
  });

  test('does not steal item focus during repeated previous-button navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await expectFooterReady(page);
    await page.waitForTimeout(800);

    const previousButton = page.getByRole('button', { name: 'Previous page' });
    const expectedLabels = ['Education', 'Experiences', 'Projects', 'About'];
    for (let index = 0; index < 12; index += 1) {
      await previousButton.dispatchEvent('click');
      await page.waitForTimeout(700);
      await expect(page.locator('.minimalist__footer-option--active [aria-pressed="true"]')).toHaveAccessibleName(
        expectedLabels[index % expectedLabels.length],
      );
      await expectCenteredActiveOption(page);
      await expectActiveOptionNotFocused(page);
    }
  });
});
