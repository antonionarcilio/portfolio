import { expect, test, type Locator, type Page } from '@playwright/test';

async function openMinimalist(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto('/en/portfolios/minimalist', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

async function hasOverflow(content: Locator) {
  return content.evaluate((element) => element.scrollHeight > element.clientHeight + 1);
}

async function expectArrowScrolls(content: Locator, collapseButton: Locator) {
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);
  await collapseButton.press('ArrowDown');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  const bottomScrollTop = await content.evaluate((element) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
    return element.scrollTop;
  });
  await collapseButton.press('ArrowUp');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeLessThan(bottomScrollTop);
}

async function expectArrowBoundaries(content: Locator, collapseButton: Locator) {
  await content.evaluate((element) => {
    element.scrollTop = 0;
  });
  await collapseButton.press('ArrowUp');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);

  await content.evaluate((element) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  });
  await collapseButton.press('ArrowDown');
  await expect
    .poll(() => content.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop))
    .toBeLessThanOrEqual(1);
}

test.describe('Minimalist expanded keyboard scroll', () => {
  test('scrolls the expanded biography from its collapse control', async ({ page }) => {
    await openMinimalist(page, 1280, 500);
    const expandButton = page.locator('button.minimalist__more').first();
    test.skip((await expandButton.count()) === 0, 'The published biography has no expandable content.');

    await expandButton.click();
    const content = page.locator('.minimalist__about-bio-panel__content');
    const collapseButton = page.getByRole('button', { name: 'Collapse', exact: true });
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published biography does not overflow at this viewport.');

    await expectArrowScrolls(content, collapseButton);
    await expectArrowBoundaries(content, collapseButton);
  });

  test('scrolls expanded project content without moving the project list', async ({ page }) => {
    await openMinimalist(page, 390, 844);
    await page.getByRole('button', { name: 'Projects', exact: true }).first().click();
    await page.waitForTimeout(600);

    const expandButton = page.locator('button.minimalist-card__expand-control').first();
    test.skip((await expandButton.count()) === 0, 'The published portfolio has no expandable project.');

    await expandButton.click();
    const content = page.locator('.minimalist-card__expanded-content').first();
    const collapseButton = page.locator('.minimalist-card--expanded .minimalist-card__expand-control');
    const grid = page.locator('.minimalist__project-grid');
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published project does not overflow at this viewport.');

    const initialGridScrollTop = await grid.evaluate((element) => element.scrollTop);
    await expectArrowScrolls(content, collapseButton);
    await expect(grid).toHaveJSProperty('scrollTop', initialGridScrollTop);
    await expectArrowBoundaries(content, collapseButton);
  });

  test('scrolls expanded experience details without changing the selected company', async ({ page }) => {
    await openMinimalist(page, 1280, 500);
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
    const expandButton = page.locator('button.minimalist__experience-trigger');
    test.skip((await expandButton.count()) === 0, 'The published portfolio has no expandable experience.');

    const companyKicker = page.locator('.minimalist__experience-kicker').first();
    const selectedCompany = await companyKicker.textContent();
    await expandButton.click();
    const content = page.locator('.minimalist__experience-expanded-fields');
    const collapseButton = page.getByRole('button', { name: 'Collapse', exact: true });
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published experience does not overflow at this viewport.');

    await expectArrowScrolls(content, collapseButton);
    await expect(companyKicker).toHaveText(selectedCompany ?? '');
    await expectArrowBoundaries(content, collapseButton);
    await expect(companyKicker).toHaveText(selectedCompany ?? '');
  });
});
