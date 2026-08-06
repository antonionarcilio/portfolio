import { expect, test, type Page } from '@playwright/test';

function installSoundPlaySpy(page: Page) {
  return page.addInitScript(() => {
    (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls = [];
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function patchedPlay(this: HTMLMediaElement) {
      (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.push(this.src);
      return originalPlay.call(this);
    };
  });
}

function playCallCount(page: Page) {
  return page.evaluate(() => (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.length);
}

function playCallCountFor(page: Page, filename: string) {
  return page.evaluate(
    (name) =>
      (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.filter((src) => src.endsWith(name)).length,
    filename,
  );
}

test.describe('Minimalist switch click sound', () => {
  test.beforeEach(async ({ page }) => {
    await installSoundPlaySpy(page);
  });

  test('enabled switch click plays clear-mouse-clicks.wav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await expect.poll(() => playCallCount(page)).toBe(1);
  });

  test('disabled switch click plays no sound', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    const disabledMode = page.getByRole('button', { name: 'C', exact: true });
    await expect(disabledMode).toBeDisabled();
    await disabledMode.click({ force: true }).catch(() => {});
    expect(await playCallCount(page)).toBe(0);
  });

  test('disabled sound preference silences switch clicks', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    const list = page.getByRole('listbox');
    // Starts on "Enlarged Cursor"; three confirmed steps forward reach "Sound Effects".
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();
    await page.getByRole('button', { name: 'Disable accessibility option', exact: true }).click();
    await page.getByRole('button', { name: 'Exit accessibility menu' }).click();

    const playsBeforeToggle = await playCallCount(page);
    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeToggle);
  });

  test('mobile viewport silences switch clicks', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(0);
  });
});

test.describe('Minimalist trigger open/close/expand sound', () => {
  test.beforeEach(async ({ page }) => {
    await installSoundPlaySpy(page);
  });

  test('opening and closing the accessibility menu plays mouse-click-close.wav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    await expect.poll(() => playCallCount(page)).toBe(1);

    await page.getByRole('button', { name: 'Exit accessibility menu' }).click();
    await expect.poll(() => playCallCount(page)).toBe(2);
  });

  test('expanding and retracting a project card plays mouse-click-close.wav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    // Navigating to the projects section also plays the section-change sound (plastic-bubble-click.wav);
    // this test only cares about mouse-click-close.wav, so it's filtered out.
    await page.locator('[data-content-step="2"]').click();
    await page.waitForTimeout(1100);

    const expandControl = page.locator('[data-project-card] .minimalist-card__expand-control').first();
    await expandControl.click();
    await expect.poll(() => playCallCountFor(page, '/mouse-click-close.wav')).toBe(1);

    const collapseControl = page.locator('[data-project-card] .minimalist-card__expand-control').first();
    await collapseControl.click();
    await expect.poll(() => playCallCountFor(page, '/mouse-click-close.wav')).toBe(2);
  });

  test('disabled sound preference silences trigger and expand clicks', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    const list = page.getByRole('listbox');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();
    await page.getByRole('button', { name: 'Disable accessibility option', exact: true }).click();

    const playsBeforeClose = await playCallCount(page);
    await page.getByRole('button', { name: 'Exit accessibility menu' }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeClose);

    await page.locator('[data-content-step="2"]').click();
    await page.waitForTimeout(1100);
    await page.locator('[data-project-card] .minimalist-card__expand-control').first().click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeClose);
  });

  test('mobile viewport silences trigger clicks', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.locator('.minimalist-a11y-trigger').click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(0);
  });
});

test.describe('Minimalist anchor click sound', () => {
  test.beforeEach(async ({ page }) => {
    await installSoundPlaySpy(page);
  });

  // Uses the "E-Mail" anchor (mailto:) rather than GitHub/LinkedIn: MinimalistAnchor
  // has no target="_blank", so clicking an http(s) link would navigate the page away
  // for real and tear down the __soundPlayCalls spy mid-test. mailto: doesn't navigate.
  test('enabled anchor click plays fast-double-click-on-mouse.wav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('link', { name: 'E-Mail' }).click();
    await expect.poll(() => playCallCount(page)).toBe(1);
  });

  test('disabled sound preference silences anchor clicks', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    const list = page.getByRole('listbox');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();
    await page.getByRole('button', { name: 'Disable accessibility option', exact: true }).click();
    await page.getByRole('button', { name: 'Exit accessibility menu' }).click();

    const playsBeforeClick = await playCallCount(page);
    await page.getByRole('link', { name: 'E-Mail' }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeClick);
  });

  test('mobile viewport silences anchor clicks', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('link', { name: 'E-Mail' }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(0);
  });
});

test.describe('Minimalist interaction sounds localization', () => {
  test.beforeEach(async ({ page }) => {
    await installSoundPlaySpy(page);
  });

  for (const locale of ['en', 'pt-BR'] as const) {
    test(`${locale} plays sound from a switch, the a11y trigger, and an anchor`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 826 });
      await page.goto(`/${locale}/portfolios/minimalist`, { waitUntil: 'networkidle' });

      const themeButton = page.getByRole('button', { name: locale === 'en' ? 'Dark' : 'Noite', exact: true });
      await themeButton.click();
      await expect.poll(() => playCallCount(page)).toBe(1);

      const trigger = page.getByRole('button', {
        name: locale === 'en' ? 'Open accessibility modes' : 'Abrir modos de acessibilidade',
        exact: true,
      });
      await trigger.click();
      await expect.poll(() => playCallCount(page)).toBe(2);
      await trigger.click();
      await expect.poll(() => playCallCount(page)).toBe(3);

      await page.getByRole('link', { name: 'E-Mail' }).click();
      await expect.poll(() => playCallCount(page)).toBe(4);
    });
  }
});

test.describe('Minimalist section change sound', () => {
  test.beforeEach(async ({ page }) => {
    await installSoundPlaySpy(page);
  });

  test('side pagination dot confirms section change', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.locator('[data-content-step="2"]').click();
    await expect.poll(() => playCallCountFor(page, '/plastic-bubble-click.wav')).toBe(1);
  });

  test('footer switch confirms section change without a duplicate switch sound', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Projects', exact: true }).click();
    await expect.poll(() => playCallCountFor(page, '/plastic-bubble-click.wav')).toBe(1);
    expect(await playCallCountFor(page, '/clear-mouse-clicks.wav')).toBe(0);
  });

  test('wheel confirms section change', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.locator('.minimalist__main').dispatchEvent('wheel', { deltaY: 600 });
    await expect.poll(() => playCallCountFor(page, '/plastic-bubble-click.wav')).toBe(1);
  });

  test('keyboard confirms section change', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'About', exact: true }).press('ArrowRight');
    await expect.poll(() => playCallCountFor(page, '/plastic-bubble-click.wav')).toBe(1);
  });

  test('disabled sound preference silences every section-change path', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    const list = page.getByRole('listbox');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();
    await page.getByRole('button', { name: 'Disable accessibility option', exact: true }).click();
    await page.getByRole('button', { name: 'Exit accessibility menu' }).click();

    // Opening/navigating the a11y panel above already played sound (default enabled); what
    // matters here is that disabling stops further plays, not the absolute count.
    const playsBeforeNav = await playCallCount(page);
    await page.locator('[data-content-step="2"]').click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeNav);
  });

  test('mobile viewport silences section-change sound', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Projects', exact: true }).click();
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(0);
  });
});
