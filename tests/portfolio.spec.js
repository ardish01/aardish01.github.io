import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', title: /^Aardish Duwal/ },
  { path: '/about', title: /^About/ },
  { path: '/projects', title: /^Projects/ },
  { path: '/capabilities', title: /^Capabilities/ },
  { path: '/contact', title: /^Contact/ },
];

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.browserErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(page.browserErrors, 'Browser should not report runtime errors').toEqual([]);
});

for (const route of routes) {
  test(`${route.path} opens directly and survives refresh`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveCount(1);
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text.trim()).not.toBe('');

    await page.reload();
    await expect(page).toHaveTitle(route.title);
    await expect(heading).toHaveText(text);
    await expect(heading).toBeVisible();
    if (route.path !== '/') {
      await expect(page.getByRole('navigation', { name: 'Main navigation' })
        .locator(`a[href="${route.path}"]`)).toHaveAttribute('aria-current', 'page');
    }
    if (['/', '/about'].includes(route.path)) {
      await expect(page.getByRole('main')).toContainText('Nightvision');
      await expect(page.getByRole('main')).toContainText(/Full Stack Developer Intern/i);
    }
  });
}

test('header navigation changes pages without reloading the document and supports browser history', async ({ page }) => {
  let documentRequests = 0;
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documentRequests++;
  });
  await page.goto('/');
  const headings = new Set();
  headings.add(await page.getByRole('heading', { level: 1 }).textContent());
  for (const route of routes.slice(1)) {
    await page.getByRole('navigation', { name: 'Main navigation' }).locator(`a[href="${route.path}"]`).click();
    await expect(page).toHaveURL(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.getByRole('main')).toBeFocused();
    headings.add(await page.getByRole('heading', { level: 1 }).textContent());
  }
  expect(headings.size, 'Each route should have its own content').toBe(routes.length);
  await page.goBack();
  await expect(page).toHaveURL('/capabilities');
  await expect(page).toHaveTitle(/^Capabilities/);
  await page.goForward();
  await expect(page).toHaveURL('/contact');
  await expect(page).toHaveTitle(/^Contact/);
  expect(documentRequests, 'Internal routes should use client-side navigation').toBe(1);
});

test('mobile navigation is keyboard accessible and closes after choosing a page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).not.toBeVisible();
  await menu.click();
  const close = page.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await expect(navigation).not.toBeVisible();

  await menu.click();
  await navigation.locator('a[href="/projects"]').click();
  await expect(page).toHaveURL('/projects');
  await expect(page).toHaveTitle(/^Projects/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
});

test('project filters show the matching work and restore all projects', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Web development', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'RDS Gears', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Real Estate Platform', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Student Performance', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Machine learning', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Product Recommender', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RDS Gears', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Data analytics', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Student Performance', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ride Demand Analysis', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Product Recommender', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RDS Gears', exact: true })).toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`all pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const size = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(size.content, `${route.path} should not overflow horizontally at ${width}px`).toBeLessThanOrEqual(size.viewport + 1);
    }
  });
}

test('reduced-motion preference keeps content visible without prolonged animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).locator('a[href="/projects"]').click();
  await expect(page).toHaveTitle(/^Projects/);
  await expect(page.getByRole('main')).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => {
    const duration = animation.effect?.getComputedTiming().endTime;
    return animation.playState === 'running' && duration > 100;
  }).length)).toBe(0);
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toBeVisible();
});
