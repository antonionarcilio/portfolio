import { expect, test, type Page } from '@playwright/test';

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

  test('keeps focus on the listbox across navigation, never on an individual option', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();

    const list = page.getByRole('listbox');
    await expect(list).toBeFocused();

    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Highlight Links' })).toBeVisible();
    await expect(list).toBeFocused();

    await page.waitForTimeout(300);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect(page.getByRole('heading', { name: '// Reduce Motion' })).toBeVisible();
    await expect(list).toBeFocused();

    // getByRole (unlike a raw class selector) respects inert/aria-hidden, so this only matches
    // the a11y panel's own selected option — not the Experience section's windowed list, which
    // shares the same component/classes but stays inert while that section isn't active.
    const selectedOptionTabIndex = await page.getByRole('option', { selected: true }).getAttribute('tabindex');
    expect(selectedOptionTabIndex).toBe('-1');
  });

  test('keeps the exit button clickable when a project is expanded', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Projects', exact: true }).click();
    await page.locator('[data-project-card] .minimalist-card__expand-control').first().click();
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();

    const exitButton = page.getByRole('button', { name: 'Exit accessibility menu', exact: true });
    await expect(exitButton).toBeEnabled();
    await exitButton.click();
    await expect(page.getByRole('complementary')).toBeHidden();
  });
});

test.describe('Minimalist accessibility panel sound effects', () => {
  const SOUND_URL = /plastic-bubble-click\.wav$/;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls = [];
      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function patchedPlay(this: HTMLMediaElement) {
        (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.push(this.src);
        return originalPlay.call(this);
      };
    });
  });

  // Filtered to this file's own sound: other Minimalist surfaces (switches, triggers,
  // anchors) also call play(), and this describe block only cares about the panel's list sound.
  const playCallCount = (page: Page) =>
    page.evaluate(
      () =>
        (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.filter((src) =>
          src.endsWith('/plastic-bubble-click.wav'),
        ).length,
    );

  test('plays the default sound on confirmed wheel and keyboard changes, never on open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    const soundRequests: string[] = [];
    page.on('request', (request) => {
      if (SOUND_URL.test(request.url())) soundRequests.push(request.url());
    });

    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    await expect(page.getByRole('complementary')).toBeVisible();
    expect(soundRequests).toHaveLength(0);
    expect(await playCallCount(page)).toBe(0);

    const list = page.getByRole('listbox');
    await list.dispatchEvent('wheel', { deltaY: 20 });
    expect(await playCallCount(page)).toBe(0);

    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect.poll(() => playCallCount(page)).toBe(1);
    await expect.poll(() => soundRequests.length).toBe(1);
    expect(soundRequests[0]).toMatch(SOUND_URL);

    await list.press('ArrowUp');
    await expect.poll(() => playCallCount(page)).toBe(2);

    for (let step = 0; step < 5; step += 1) {
      // Space out dispatches past the post-confirm cooldown: each is a deliberate, separate scroll.
      await page.waitForTimeout(300);
      await list.dispatchEvent('wheel', { deltaY: 80 });
      await expect.poll(() => playCallCount(page)).toBe(3 + step);
    }
  });

  test('rapid keyboard repeats play every confirmed change, unlike wheel', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();

    // Simulate holding the key down: many keydown events fired back-to-back in the same tick,
    // which the wheel's cooldown would have collapsed into a single confirmation.
    // getByRole (unlike a raw attribute selector) respects inert/aria-hidden, so this only
    // matches the a11y panel's own listbox, not the inert one in the Experience section.
    await page.getByRole('listbox').evaluate((listbox) => {
      for (let i = 0; i < 5; i += 1) {
        listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      }
    });

    await expect.poll(() => playCallCount(page)).toBe(5);
  });

  test('a single rapid flick confirms at most one change, not one per threshold crossing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    await expect(page.getByRole('heading', { name: '// Enlarged Cursor' })).toBeVisible();

    // One continuous trackpad flick: many small deltas fired back-to-back in the same tick,
    // summing well past the threshold more than once if nothing throttles it.
    // getByRole (unlike a raw attribute selector) respects inert/aria-hidden, so this only
    // matches the a11y panel's own listbox, not the inert one in the Experience section.
    await page.getByRole('listbox').evaluate((listbox) => {
      const deltas = [6, 8, 10, 14, 18, 20, 22, 20, 18, 14, 10, 8, 6, 4, 3, 2];
      for (const deltaY of deltas) {
        listbox.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
      }
    });

    await expect(page.getByRole('heading', { name: '// Highlight Links' })).toBeVisible();
  });

  test('is reachable as a list option, toggled via the shared YES/NO controls, and persists across reload', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 826 });

    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();

    const list = page.getByRole('listbox');
    // Starts on "Enlarged Cursor"; three confirmed steps forward reach "Sound Effects".
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();

    const disableButton = page.getByRole('button', { name: 'Disable accessibility option', exact: true });
    const enableButton = page.getByRole('button', { name: 'Enable accessibility option', exact: true });
    await expect(enableButton).toHaveAttribute('aria-pressed', 'true');

    // Three more steps wrap the circular list of six options back to the start.
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Enlarged Cursor' })).toBeVisible();
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();

    await disableButton.click();
    await expect(disableButton).toHaveAttribute('aria-pressed', 'true');

    // The keyboard navigation above already played sound several times (default enabled);
    // what matters here is that disabling stops further plays, not the absolute count.
    const playsBeforeDisabled = await playCallCount(page);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(playsBeforeDisabled);

    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();
    expect(await playCallCount(page)).toBe(0);

    const listAfterReload = page.getByRole('listbox');
    await listAfterReload.press('ArrowDown');
    await listAfterReload.press('ArrowDown');
    await listAfterReload.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();
    await expect(disableButton).toHaveAttribute('aria-pressed', 'true');

    await enableButton.click();
    await listAfterReload.dispatchEvent('wheel', { deltaY: 80 });
    await expect.poll(() => playCallCount(page)).toBe(1);
  });

  test('shows the option disabled and silent on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.locator('.minimalist-a11y-trigger').click();

    const list = page.getByRole('listbox');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await list.press('ArrowDown');
    await expect(page.getByRole('heading', { name: '// Sound Effects' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Enable accessibility option', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Disable accessibility option', exact: true })).toBeDisabled();
    expect(await playCallCount(page)).toBe(0);
  });

  test('resizing into mobile goes silent without erasing the persisted preference', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open accessibility modes', exact: true }).click();

    const list = page.getByRole('listbox');
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect.poll(() => playCallCount(page)).toBe(1);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await page.waitForTimeout(200);
    expect(await playCallCount(page)).toBe(1);

    const storedPreference = await page.evaluate(() => JSON.parse(localStorage.getItem('a11y-opts') ?? '{}'));
    expect(storedPreference.soundEffects).toBe(true);

    await page.setViewportSize({ width: 1280, height: 826 });
    await page.waitForTimeout(300);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect.poll(() => playCallCount(page)).toBe(2);
  });
});
