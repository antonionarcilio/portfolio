import { expect, test } from '@playwright/test';

test.describe('Minimalist experience section', () => {
  test('shows the company kicker, the period, and an enabled Expand button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    const detail = page.locator('.minimalist__experience-detail');
    await expect(detail.locator('.minimalist__experience-kicker')).toBeVisible();
    await expect(detail.locator('.minimalist__experience-period')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Expand', exact: true })).toBeEnabled();
  });

  test('renders a single static entry without circular controls when only one company is published', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    // tabindex directly mirrors the component's own circularNavigationActive flag (items.length > 1)
    // — role="option" can't be used here since non-selected window slots are aria-hidden.
    const list = page.getByRole('listbox', { name: 'EXPERIENCES' });
    const hasCircularNavigation = (await list.getAttribute('tabindex')) === '0';
    test.skip(
      hasCircularNavigation,
      'Multiple experience entries are published; covered by the circular navigation test instead.',
    );

    await expect(list.locator('.minimalist-windowed-list__option')).toHaveCount(1);
    await expect(list).toHaveAttribute('tabindex', '-1');
    await expect(list.locator('.minimalist-windowed-list__gradient')).toHaveCount(0);
  });

  test('navigates the company list circularly via wheel and keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    const list = page.getByRole('listbox', { name: 'EXPERIENCES' });
    const hasCircularNavigation = (await list.getAttribute('tabindex')) === '0';
    test.skip(
      !hasCircularNavigation,
      'Only one experience entry is currently published; circular navigation stays inactive by design.',
    );

    const companyKicker = page.locator('.minimalist__experience-kicker');
    const initialCompany = await companyKicker.textContent();

    await list.press('ArrowDown');
    await expect(companyKicker).not.toHaveText(initialCompany ?? '');
    await list.press('ArrowUp');
    await expect(companyKicker).toHaveText(initialCompany ?? '');

    // Boundary: retreating before the first entry wraps to the last, without an empty gap.
    await list.press('ArrowUp');
    await expect(companyKicker).not.toHaveText(initialCompany ?? '');

    // Circularity: repeatedly advancing must eventually cycle back to the starting company
    // (the exact company count isn't known from the DOM — the window always renders 5 slots).
    let cycledBack = false;
    for (let step = 0; step < 20; step += 1) {
      await list.press('ArrowDown');
      if ((await companyKicker.textContent()) === initialCompany) {
        cycledBack = true;
        break;
      }
    }
    expect(cycledBack).toBe(true);

    await page.waitForTimeout(300);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect(companyKicker).not.toHaveText(initialCompany ?? '');
  });

  test('plays the same confirmation sound as the a11y menu list on wheel and keyboard changes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.addInitScript(() => {
      (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls = [];
      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function patchedPlay(this: HTMLMediaElement) {
        (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.push(this.src);
        return originalPlay.call(this);
      };
    });
    const playCallCount = () =>
      page.evaluate(
        () =>
          (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls.filter((src) =>
            src.endsWith('/plastic-bubble-click.wav'),
          ).length,
      );

    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    const list = page.getByRole('listbox', { name: 'EXPERIENCES' });
    const hasCircularNavigation = (await list.getAttribute('tabindex')) === '0';
    test.skip(
      !hasCircularNavigation,
      'Only one experience entry is currently published; circular navigation stays inactive by design.',
    );

    // Footer navigation to this page plays the same shared sound file (section change, not company
    // change) — reset the tally so the baseline reflects the list's own confirmations only.
    await page.evaluate(() => {
      (window as unknown as { __soundPlayCalls: string[] }).__soundPlayCalls = [];
    });
    expect(await playCallCount()).toBe(0);
    await list.press('ArrowDown');
    await expect.poll(() => playCallCount()).toBe(1);

    await page.waitForTimeout(300);
    await list.dispatchEvent('wheel', { deltaY: 80 });
    await expect.poll(() => playCallCount()).toBe(2);
  });

  test('expands the detail panel via FLIP, showing aliases, work mode, and the labeled fields', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    const detail = page.locator('.minimalist__experience-detail');
    const collapsedKicker = await detail.locator('.minimalist__experience-kicker').textContent();

    await page.getByRole('button', { name: 'Expand', exact: true }).click();

    const expandedKicker = detail.locator('.minimalist__experience-kicker');
    await expect(expandedKicker).toHaveText(/\|/); // joins all CMS aliases with " | "
    await expect(expandedKicker).not.toHaveText(collapsedKicker ?? '');
    await expect(detail.getByRole('heading', { name: 'Role:' })).toBeVisible();
    await expect(detail.getByRole('heading', { name: 'Experience' })).toBeVisible();
    await expect(detail.getByRole('heading', { name: 'A bit about it:' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse', exact: true })).toBeVisible();
  });

  test('collapse returns to the original layout, via the Collapse button and via Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();

    const detail = page.locator('.minimalist__experience-detail');
    const collapsedKicker = await detail.locator('.minimalist__experience-kicker').textContent();
    const expandButton = page.getByRole('button', { name: 'Expand', exact: true });

    await expandButton.click();
    await page.getByRole('button', { name: 'Collapse', exact: true }).click();
    await expect(detail.locator('.minimalist__experience-kicker')).toHaveText(collapsedKicker ?? '');
    await expect(expandButton).toBeFocused();

    await expandButton.click();
    await page.keyboard.press('Escape');
    await expect(detail.locator('.minimalist__experience-kicker')).toHaveText(collapsedKicker ?? '');
    await expect(expandButton).toBeFocused();
  });

  test('shows a scroll gradient only when the full description overflows the expanded field', async ({ page }) => {
    // Short viewport forces the description to overflow its fixed-height field.
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
    await page.getByRole('button', { name: 'Expand', exact: true }).click();

    const content = page.locator('.minimalist__experience-expanded-fields');
    const gradient = page.locator('.minimalist__experience-expanded-gradient');
    await expect(gradient).toBeVisible();

    await content.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await expect(gradient).toBeHidden();
  });
});
