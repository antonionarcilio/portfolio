import { expect, test } from '@playwright/test';

test.describe('Minimalist experience section', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 826 });
    await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
  });

  test('renders the desktop Figma composition with both content columns and timeline', async ({ page }) => {
    const experience = page.locator('.minimalist__experience--collapsed');

    await expect(experience.locator('.minimalist__experience-column--left')).toContainText('Area of expertise');
    await expect(experience.locator('.minimalist__experience-column--right')).toBeVisible();
    await expect(experience.locator('.minimalist__experience-description').first()).not.toContainText('**');
    await expect(experience.locator('.minimalist__experience-description').first()).toHaveCSS(
      '-webkit-line-clamp',
      '8',
    );
    await expect(page.locator('[data-minimalist-timeline="experience"]')).toBeVisible();
    await expect(page.locator('.minimalist-timeline__label')).toHaveCount(2);
    await expect(experience.getByRole('button', { name: 'See more', exact: true })).toHaveCount(2);
  });

  test('derives the timeline labels from the CMS experience dates', async ({ page }) => {
    const labels = page.locator('[data-minimalist-timeline="experience"] .minimalist-timeline__label');

    await expect(labels.nth(0)).toHaveText('2026');
    await expect(labels.nth(1)).toHaveText('2022');
  });

  test('keeps the secondary underline hidden in the regular state after reload', async ({ page }) => {
    const wave = page.locator('.minimalist__experience--collapsed .minimalist-button__wave').first();

    await expect(wave).toHaveCSS('opacity', '0');
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
    await expect(wave).toHaveCSS('opacity', '0');
  });

  test('reveals and animates the secondary underline on hover', async ({ page }) => {
    const button = page.locator('.minimalist__experience--collapsed .minimalist-button').first();
    const wave = button.locator('.minimalist-button__wave');

    await button.hover();
    await expect(wave).toHaveCSS('opacity', '1');
    await page.mouse.move(0, 0);
    await expect(wave).toHaveCSS('opacity', '0');
  });

  test('both secondary triggers open the same expanded content with a fade shell', async ({ page }) => {
    const experience = page.locator('.minimalist__experience--collapsed');
    const triggers = experience.getByRole('button', { name: 'See more', exact: true });

    await triggers.nth(0).click();
    await expect(page.locator('.minimalist__experience--collapsed')).toHaveCount(0);
    await expect(page.locator('.minimalist__experience-expanded-view')).toBeVisible();
    await expect(page.locator('.minimalist__experience-detail--overlay')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Role:' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'A bit about it:' })).toBeVisible();

    await page.getByRole('button', { name: 'Collapse', exact: true }).click();
    await expect(page.locator('.minimalist__experience--collapsed')).toBeVisible();
    await triggers.nth(1).click();
    await expect(page.locator('.minimalist__experience-expanded-view')).toBeVisible();
  });

  test('collapse returns focus to the trigger that opened the shared content', async ({ page }) => {
    const triggers = page.locator('.minimalist__experience--collapsed').getByRole('button', { name: 'See more' });

    await triggers.nth(1).click();
    await page.getByRole('button', { name: 'Collapse', exact: true }).click();
    await expect(triggers.nth(1)).toBeFocused();

    await triggers.nth(1).click();
    await page.keyboard.press('Escape');
    await expect(triggers.nth(1)).toBeFocused();
  });

  test('preserves the expanded content scroll gradient behavior', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
    await page.locator('.minimalist__experience--collapsed').getByRole('button', { name: 'See more' }).first().click();

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
