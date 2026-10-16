import { expect, test, type Locator, type Page } from '@playwright/test';

async function openMinimalist(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto('/en', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

async function hasOverflow(content: Locator) {
  return content.evaluate((element) => element.scrollHeight > element.clientHeight + 1);
}

// The expanded content area auto-focuses itself when it mounts (see `focusExpandedFields` /
// `fieldsRef` callback refs across about-bio-panel, section's ExperiencePage and
// ProjectExpandedPanel), so arrow keys are pressed directly on it rather than on a separate
// collapse control — there is no longer a per-section collapse button to press them from.
async function expectArrowScrolls(content: Locator) {
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);
  await content.press('ArrowDown');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  const bottomScrollTop = await content.evaluate((element) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
    return element.scrollTop;
  });
  await content.press('ArrowUp');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeLessThan(bottomScrollTop);
}

async function expectArrowBoundaries(content: Locator) {
  await content.evaluate((element) => {
    element.scrollTop = 0;
  });
  await content.press('ArrowUp');
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);

  await content.evaluate((element) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  });
  await content.press('ArrowDown');
  await expect
    .poll(() => content.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop))
    .toBeLessThanOrEqual(1);
}

test.describe('Minimalist expanded keyboard scroll', () => {
  test('scrolls the expanded biography from its auto-focused content area', async ({ page }) => {
    await openMinimalist(page, 1280, 500);
    const expandButton = page.getByRole('button', { name: 'See more', exact: true }).first();
    test.skip((await expandButton.count()) === 0, 'The published biography has no expandable content.');

    await expandButton.click();
    const content = page.locator('.minimalist__about-bio-panel__fields');
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published biography does not overflow at this viewport.');

    await expectArrowScrolls(content);
    await expectArrowBoundaries(content);
  });

  test('scrolls expanded project content without moving the project list', async ({ page }) => {
    await openMinimalist(page, 390, 844);
    await page.getByRole('button', { name: 'Projects', exact: true }).first().click();
    await page.waitForTimeout(600);

    const expandButton = page.locator('button.minimalist-card__expand-control').first();
    test.skip((await expandButton.count()) === 0, 'The published portfolio has no expandable project.');

    const grid = page.locator('.minimalist__project-grid');
    const initialGridScrollTop = await grid.evaluate((element) => element.scrollTop);

    await expandButton.click();
    const content = page.locator('[data-project-expanded-content="true"]');
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published project does not overflow at this viewport.');

    await expectArrowScrolls(content);
    // The collapsed grid is unmounted while a project is expanded, so this only verifies its
    // scroll position is restored once we collapse back to it.
    await page.getByRole('button', { name: 'Collapse', exact: true }).click();
    await expect(grid).toHaveJSProperty('scrollTop', initialGridScrollTop);
  });

  test('scrolls expanded experience details without changing the selected company', async ({ page }) => {
    await openMinimalist(page, 1280, 500);
    await page.getByRole('button', { name: 'Experiences', exact: true }).first().click();
    const expandButtons = page.locator('.minimalist__experience--collapsed').getByRole('button', { name: 'See more' });
    test.skip((await expandButtons.count()) === 0, 'The published portfolio has no expandable experience.');

    const companyTitle = page.locator('.minimalist__experience-column--right .minimalist__experience-title').first();
    const selectedCompany = await companyTitle.textContent();
    await expandButtons.first().click();
    const content = page.locator('.minimalist__experience-expanded-fields');
    await expect(content).toBeVisible();
    test.skip(!(await hasOverflow(content)), 'The published experience does not overflow at this viewport.');

    await expectArrowScrolls(content);
    await expectArrowBoundaries(content);

    await page.getByRole('button', { name: 'Collapse', exact: true }).click();
    await expect(companyTitle).toHaveText(selectedCompany ?? '');
  });
});
