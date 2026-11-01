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
      await expect(page.getByRole('main')).toContainText('NightVision');
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
  const menu = page.getByRole('button', { name: 'Toggle navigation', exact: true });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).not.toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await expect(navigation).not.toBeVisible();

  await menu.click();
  await navigation.locator('a[href="/projects#projects"]').click();
  await expect(page).toHaveURL('/projects#projects');
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

test('mobile header and drawer meet the sticky glass specification', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');

  const header = await page.evaluate(() => {
    const element = document.querySelector('header');
    const style = getComputedStyle(element);
    const toggle = element.querySelector('button[aria-controls="mobile-nav"]');
    const rect = toggle.getBoundingClientRect();
    const bars = [...toggle.querySelectorAll('span span')];
    return {
      position: style.position,
      top: style.top,
      height: style.height,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      zIndex: style.zIndex,
      backdrop: style.backdropFilter,
      background: style.backgroundColor,
      borderBottom: style.borderBottomWidth,
      borderColor: style.borderBottomColor,
      toggle: {
        width: rect.width,
        height: rect.height,
        label: toggle.getAttribute('aria-label'),
        expanded: toggle.getAttribute('aria-expanded'),
        controls: toggle.getAttribute('aria-controls'),
      },
      bars: bars.map((bar) => ({
        duration: getComputedStyle(bar).transitionDuration,
        timing: getComputedStyle(bar).transitionTimingFunction,
      })),
      mainPaddingTop: getComputedStyle(document.querySelector('main')).paddingTop,
    };
  });
  expect(header.position, 'header is fixed').toBe('fixed');
  expect(header.top, 'header is pinned to the top').toBe('0px');
  expect(header.height, 'header is 60px tall').toBe('60px');
  expect([header.paddingTop, header.paddingRight, header.paddingBottom, header.paddingLeft], 'header padding').toEqual(['0px', '20px', '0px', '20px']);
  expect(header.zIndex, 'header sits above content').toBe('50');
  expect(header.backdrop, 'glass blur').toContain('blur(12px)');
  expect(header.background, 'semi-transparent background').toContain('0.78');
  expect(header.borderBottom, 'header border width').toBe('1px');
  expect(header.borderColor, 'header border opacity').toMatch(/\/ 0\.1\)$/);
  expect(header.toggle).toEqual({
    width: 44, height: 44, label: 'Toggle navigation', expanded: 'false', controls: 'mobile-nav',
  });
  for (const bar of header.bars) {
    expect(bar.duration, 'icon transition duration').toBe('0.25s');
    expect(bar.timing, 'icon transition easing').toBe('cubic-bezier(0.22, 1, 0.36, 1)');
  }
  expect(header.mainPaddingTop, 'content clears the fixed header').toBe('60px');

  for (const [path, id] of [['/about', 'about'], ['/projects', 'projects'], ['/capabilities', 'capabilities'], ['/contact', 'contact']]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
    expect(await page.evaluate((target) => getComputedStyle(document.getElementById(target)).scrollMarginTop, id), `${path} scroll margin`).toBe('72px');
  }
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });

  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.click();
  await page.waitForTimeout(300);
  const open = await page.evaluate(() => {
    const drawer = document.getElementById('mobile-nav');
    const style = getComputedStyle(drawer);
    const links = [...drawer.querySelectorAll('a[href*="#"]')];
    const toggleButton = document.querySelector('header button[aria-controls="mobile-nav"]');
    return {
      bodyOverflow: getComputedStyle(document.body).overflow,
      drawer: {
        visibility: style.visibility,
        opacity: style.opacity,
        top: style.top,
        zIndex: style.zIndex,
        duration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
        height: drawer.getBoundingClientRect().height,
      },
      links: links.map((link) => ({
        href: link.getAttribute('href'),
        height: link.getBoundingClientRect().height,
        size: getComputedStyle(link).fontSize,
        weight: getComputedStyle(link).fontWeight,
        border: getComputedStyle(link).borderBottomWidth,
        numberSize: getComputedStyle(link.querySelector('span')).fontSize,
      })),
      barTransforms: [...toggleButton.querySelectorAll('span span')].map((bar) => getComputedStyle(bar).transform),
      email: drawer.querySelector('a[href^="mailto:"]')?.getAttribute('href'),
      github: drawer.querySelector('a[href="https://github.com/ardish01"]')?.textContent.trim(),
      location: drawer.textContent.includes('Bhaktapur, Nepal'),
    };
  });
  expect(open.bodyOverflow, 'body scroll is locked').toBe('hidden');
  expect(open.drawer.visibility).toBe('visible');
  expect(open.drawer.opacity).toBe('1');
  expect(open.drawer.top, 'drawer starts below the header').toBe('60px');
  expect(open.drawer.zIndex).toBe('40');
  expect(open.drawer.duration).toContain('0.25s');
  expect(open.drawer.transitionProperty, 'drawer slides and fades').toContain('transform');
  expect(open.drawer.height).toBeGreaterThan(700);
  expect(open.links.map((link) => link.href), 'drawer routes').toEqual([
    '/about#about', '/projects#projects', '/capabilities#capabilities', '/contact#contact',
  ]);
  expect(open.links.map((link) => link.height), 'drawer row height').toEqual([56, 56, 56, 56]);
  expect(open.links.every((link) => link.size === '24px' && link.weight === '700'), 'drawer link typography').toBe(true);
  expect(open.links.map((link) => link.border), 'drawer dividers').toEqual(['1px', '1px', '1px', '0px']);
  expect(open.links.every((link) => link.numberSize === '12.8px'), 'drawer numbers').toBe(true);
  expect(open.barTransforms.every((transform) => transform !== 'none'), 'icon morphs to an X').toBe(true);
  expect(open.email, 'drawer email action').toBe('mailto:aardish01@gmail.com');
  expect(open.github, 'drawer GitHub action').toContain('Find me on GitHub');
  expect(open.location, 'drawer location badge').toBe(true);

  await page.locator('#mobile-nav a[href="/projects#projects"]').click();
  await expect(page).toHaveURL('/projects#projects');
  await expect(page.getByRole('main')).toBeFocused();
  const afterClick = await page.evaluate(() => ({
    bodyOverflow: document.body.style.overflow,
    expanded: document.querySelector('header button[aria-controls="mobile-nav"]').getAttribute('aria-expanded'),
    drawerVisibility: getComputedStyle(document.getElementById('mobile-nav')).visibility,
    scrollMargin: getComputedStyle(document.getElementById('projects')).scrollMarginTop,
    smooth: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(afterClick.bodyOverflow, 'body scroll is unlocked').toBe('');
  expect(afterClick.expanded, 'drawer closes after a link').toBe('false');
  expect(afterClick.drawerVisibility).toBe('hidden');
  expect(afterClick.scrollMargin).toBe('72px');
  expect(afterClick.smooth, 'smooth scrolling is enabled globally').toBe('smooth');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow), 'Escape unlocks scroll').toBe('');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(toggle).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow), 'resize unlocks scroll').toBe('');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

  await page.setViewportSize({ width: 768, height: 900 });
  await expect(toggle).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
});

test('mobile section pages use compact headers and scannable cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/projects', '/capabilities', '/contact']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
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
    expect(header.borderTop, `${path} header border`).toBe('0px');
    expect(header.paddingTop, `${path} header top padding`).toBe('0px');
    expect(header.marginBottom, `${path} header bottom margin`).toBe('24px');
    expect(header.eyebrowSize, `${path} section number size`).toBe('12px');
    expect(header.eyebrowMargin, `${path} section number spacing`).toBe('8px');
    expect(header.eyebrowColor, `${path} section number is teal`).toBe('rgb(95, 224, 200)');
    expect(header.shellPaddingTop, `${path} page top padding`).toBe('24px');
    expect(header.animationName, `${path} uses a CSS entrance`).toBe('fade-up');
    expect(header.animationDuration, `${path} entrance is lightweight`).toBe('0.5s');
  }

  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#project-grid article').first()).toBeVisible({ timeout: 10000 });
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
  expect(project.coverAspect, 'project cover is 21:9 on mobile').toBe('21 / 9');
  expect(project.coverRadius, 'project cover radius').toBe('10px');
  expect(project.titleSize, 'project title size').toBe('20px');
  expect(project.titleWeight, 'project title weight').toBe('700');
  expect(project.lineClamp, 'description is clamped to three lines').toBe('3');
  expect(project.iconSize, 'GitHub tap target').toEqual([44, 44]);
  expect(project.pillSize, 'tech pill size').toBe('12px');
  expect(project.pillPadding, 'tech pill padding').toBe('4px 10px');
  expect(project.bottomLinkDisplay, 'bottom link is replaced by icon links').toBe('none');

  await page.goto('/capabilities');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('section[aria-label="Skills and tools"]').first()).toBeVisible({ timeout: 10000 });
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
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  const contact = await page.evaluate(() => {
    const main = document.querySelector('main');
    const email = main.querySelector('a[href^="mailto:"]');
    const copy = main.querySelector('button[type="button"]');
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
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('h1').parentElement).animationName)).toBe('none');
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => {
    const duration = animation.effect?.getComputedTiming().endTime;
    return animation.playState === 'running' && duration > 100;
  }).length)).toBe(0);
  await expect(page.getByRole('heading', { name: 'AI Diabetes Risk System', exact: true })).toBeVisible();
});
