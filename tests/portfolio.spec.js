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

test('mobile section pages use compact headers and scannable cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/projects', '/capabilities', '/contact']) {
    await page.goto(path);
    const header = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const wrapper = heading.parentElement;
      const eyebrow = wrapper.querySelector('p');
      const shell = wrapper.parentElement;
      return {
        borderTop: getComputedStyle(wrapper).borderTopWidth,
        paddingTop: getComputedStyle(wrapper).paddingTop,
        marginBottom: getComputedStyle(wrapper).marginBottom,
        eyebrowSize: getComputedStyle(eyebrow).fontSize,
        eyebrowMargin: getComputedStyle(eyebrow).marginBottom,
        eyebrowColor: getComputedStyle(eyebrow).color,
        shellPaddingTop: getComputedStyle(shell).paddingTop,
        animationName: getComputedStyle(wrapper).animationName,
        animationDuration: getComputedStyle(wrapper).animationDuration,
      };
    });
    expect(header.borderTop, `${path} header border`).toBe('1px');
    expect(header.paddingTop, `${path} header top padding`).toBe('48px');
    expect(header.marginBottom, `${path} header bottom margin`).toBe('24px');
    expect(header.eyebrowSize, `${path} section number size`).toBe('12px');
    expect(header.eyebrowMargin, `${path} section number spacing`).toBe('8px');
    expect(header.eyebrowColor, `${path} section number is muted`).toMatch(/\/ 0\.8\)$/);
    expect(header.shellPaddingTop, `${path} page top padding`).toBe('24px');
    expect(header.animationName, `${path} uses a CSS entrance`).toBe('fade-up');
    expect(header.animationDuration, `${path} entrance is lightweight`).toBe('0.5s');
  }

  await page.goto('/projects');
  const project = await page.evaluate(() => {
    const card = document.querySelector('#project-grid article');
    const cover = card.querySelector('[class*="aspect-"]');
    const title = card.querySelector('h2');
    const description = card.querySelector('p');
    const icon = card.querySelector('a.h-11.w-11');
    const pill = card.querySelector('[aria-label$="tech stack"] span');
    const bottomLink = [...card.querySelectorAll('a')].find((link) => link.textContent.includes('View on GitHub'));
    const grid = document.querySelector('#project-grid');
    return {
      columns: getComputedStyle(grid).gridTemplateColumns,
      gap: getComputedStyle(grid).rowGap,
      coverAspect: getComputedStyle(cover).aspectRatio,
      coverRadius: getComputedStyle(cover).borderRadius,
      titleSize: getComputedStyle(title).fontSize,
      titleWeight: getComputedStyle(title).fontWeight,
      lineClamp: getComputedStyle(description).webkitLineClamp,
      iconSize: [icon.getBoundingClientRect().width, icon.getBoundingClientRect().height],
      pillSize: getComputedStyle(pill).fontSize,
      pillPadding: getComputedStyle(pill).padding,
      bottomLinkDisplay: getComputedStyle(bottomLink).display,
    };
  });
  expect(project.columns.trim().split(/\s+/), 'projects are a single column').toHaveLength(1);
  expect(project.gap, 'project cards are 24px apart').toBe('24px');
  expect(project.coverAspect, 'project cover is 16:10').toBe('16 / 10');
  expect(project.coverRadius, 'project cover radius').toBe('10px');
  expect(project.titleSize, 'project title size').toBe('20px');
  expect(project.titleWeight, 'project title weight').toBe('700');
  expect(project.lineClamp, 'description is clamped to two lines').toBe('2');
  expect(project.iconSize, 'GitHub tap target').toEqual([44, 44]);
  expect(project.pillSize, 'tech pill size').toBe('12px');
  expect(project.pillPadding, 'tech pill padding').toBe('4px 10px');
  expect(project.bottomLinkDisplay, 'bottom link is replaced by icon links').toBe('none');

  await page.goto('/capabilities');
  const capabilities = await page.evaluate(() => {
    const section = document.querySelector('section[aria-label="Skills and tools"]');
    const card = section.firstElementChild;
    return {
      display: getComputedStyle(section).display,
      gap: getComputedStyle(section).gap,
      border: getComputedStyle(card).borderTopWidth,
      radius: getComputedStyle(card).borderRadius,
      padding: getComputedStyle(card).padding,
      titleSize: getComputedStyle(card.querySelector('h2')).fontSize,
    };
  });
  expect(capabilities.display, 'capabilities stack as cards').toBe('flex');
  expect(capabilities.gap, 'category cards are 16px apart').toBe('16px');
  expect(capabilities.border, 'category card border').toBe('1px');
  expect(capabilities.radius, 'category card radius').toBe('16px');
  expect(capabilities.padding, 'category card padding').toBe('16px');
  expect(capabilities.titleSize, 'category title size').toBe('20px');

  await page.goto('/contact');
  const contact = await page.evaluate(() => {
    const email = document.querySelector('a[href^="mailto:"]');
    const copy = document.querySelector('button[type="button"]');
    const nav = document.querySelector('nav[aria-label="Find me online"]');
    const socials = [...nav.querySelectorAll('a')];
    const footer = document.querySelector('footer');
    const copyright = [...footer.querySelectorAll('span')]
      .filter((span) => span.textContent.includes('©') && getComputedStyle(span).display !== 'none');
    return {
      emailHeight: email.getBoundingClientRect().height,
      emailWidth: email.getBoundingClientRect().width,
      copyHeight: copy.getBoundingClientRect().height,
      copyWidth: copy.getBoundingClientRect().width,
      socialColumns: getComputedStyle(nav).gridTemplateColumns,
      socialHeights: socials.map((link) => link.getBoundingClientRect().height),
      footerDirection: getComputedStyle(footer).flexDirection,
      footerAlign: getComputedStyle(footer).alignItems,
      footerPaddingBottom: getComputedStyle(footer).paddingBottom,
      copyright: copyright.map((span) => span.textContent.trim()),
    };
  });
  expect(contact.emailHeight, 'email CTA height').toBeGreaterThanOrEqual(52);
  expect(contact.emailWidth, 'email CTA is full width').toBeGreaterThan(280);
  expect(contact.copyHeight, 'copy button height').toBeGreaterThanOrEqual(52);
  expect(contact.copyWidth, 'copy button is full width').toBeGreaterThan(280);
  expect(contact.socialColumns.trim().split(/\s+/), 'socials use two columns').toHaveLength(2);
  expect(Math.min(...contact.socialHeights), 'social tap targets').toBeGreaterThanOrEqual(44);
  expect(contact.footerDirection, 'footer stacks on mobile').toBe('column');
  expect(contact.footerAlign, 'footer is centered').toBe('center');
  expect(contact.footerPaddingBottom, 'footer clears mobile browser chrome').toBe('32px');
  expect(contact.copyright, 'footer copyright is one line').toHaveLength(1);
  expect(contact.copyright[0], 'footer copyright layout').toMatch(/^© \d{4} Aardish Duwal · Bhaktapur, Nepal$/);

  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('p[role="status"]')).toHaveText('Copied!');
});

test('reduced-motion preference keeps content visible without prolonged animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).locator('a[href="/projects"]').click();
  await expect(page).toHaveTitle(/^Projects/);
  await expect(page.getByRole('main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('h1').parentElement).animationName)).toBe('none');
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => {
    const duration = animation.effect?.getComputedTiming().endTime;
    return animation.playState === 'running' && duration > 100;
  }).length)).toBe(0);
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toBeVisible();
});
