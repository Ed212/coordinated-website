import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { checkCopy } from './check-copy.mjs';
import { measureHeroContrast } from './hero-contrast.mjs';

const prefix = process.env.VERIFY_PREFIX || '';
const base = new URL(process.env.BASE_URL || 'http://127.0.0.1:4174');
const headline = 'Turn product momentum into market growth.';
const walkthrough = 'Walk through your last launch';
const email = 'mailto:ed@coordinatedai.ai?subject=30-minute%20launch%20walkthrough';
const documents = new Map(), contrastLog = [], log = [];
const normalize = text => text.replace(/\s+/g, ' ').trim();
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
await mkdir('docs/site-v5/screenshots', { recursive: true });
await mkdir('docs/site-v5/logs', { recursive: true });

function recordErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(`${message.text()} ${message.location().url || ''}`); });
  return errors;
}

async function checkLinks(page) {
  for (const href of await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    const url = new URL(href, page.url());
    if (url.origin !== base.origin) continue;
    const key = url.origin + url.pathname;
    if (!documents.has(key)) {
      const response = await page.request.get(key);
      assert(response.ok(), `Broken link ${href}`);
      documents.set(key, await response.text());
    }
    if (url.hash) assert(await page.evaluate(({ html, id }) => new DOMParser().parseFromString(html, 'text/html').getElementById(id) !== null,
      { html: documents.get(key), id: decodeURIComponent(url.hash.slice(1)) }), `Broken anchor ${href}`);
  }
}

async function checkImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 15));
    }
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  });
  const images = await page.locator('img').evaluateAll(elements => elements.map(image => ({ alt: image.getAttribute('alt'), loaded: image.complete && image.naturalWidth > 0 })));
  assert(images.every(image => image.alt !== null && image.loaded), 'Missing alt attribute or broken image');
}

async function checkNavigation(page) {
  const links = await page.locator('nav a').evaluateAll(elements => elements.map(link => ({ href: link.getAttribute('href'), text: link.textContent.replace(/\s+/g, ' ').trim().replace(/’/g, "'") })));
  assert(!links.some(link => /(?:^|\/)b(?:\.html)?(?:$|[?#])/.test(link.href)), 'B variant stays unlinked');
  for (const link of links) {
    if (/(?:^|\/)use-cases(?:\.html)?(?:$|[?#])/.test(link.href)) assert.equal(link.text, 'Launch example');
    if (/(?:^|\/)pilot-evidence(?:\.html)?(?:$|[?#])/.test(link.href)) assert.equal(link.text, "How we'll measure");
  }
  assert(await page.locator('.primary-nav').evaluate(nav => nav.scrollWidth <= nav.clientWidth + 1), 'Primary navigation is not horizontally clipped');
  assert(await page.locator('.site-header').evaluate(header => {
    const brand = header.querySelector('.brand').getBoundingClientRect(), nav = header.querySelector('nav').getBoundingClientRect();
    return brand.right <= nav.left + 1 || nav.right <= brand.left + 1 || brand.bottom <= nav.top + 1 || nav.bottom <= brand.top + 1;
  }), 'Brand and navigation do not overlap');
}

async function checkFocus(page) {
  await page.keyboard.press('Tab');
  for (const control of await page.locator('a, button, input:not([tabindex="-1"]), textarea, summary, [tabindex="0"]').all()) {
    if (!await control.isVisible() || await control.isDisabled()) continue;
    await control.focus();
    assert(await control.evaluate(element => { const style = getComputedStyle(element); return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0; }), 'Missing visible keyboard focus: ' + await control.evaluate(element => element.outerHTML.slice(0, 180)));
  }
}

async function checkCTA(page, initiallyVisible = false) {
  const actions = page.locator('a[data-pilot-action]');
  for (const action of await actions.all()) {
    assert.equal(normalize(await action.textContent()), walkthrough);
    assert.equal(await action.getAttribute('href'), email);
  }
  if (await page.locator('.hero').count()) {
    const action = page.locator('.hero [data-pilot-action]');
    assert.equal(await action.count(), 1);
    if (!initiallyVisible) await action.scrollIntoViewIfNeeded();
    assert(await action.evaluate(element => { const rect = element.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth; }), 'Primary CTA is visible and unclipped');
  }
}

async function checkHeadings(page) {
  assert(await page.evaluate(() => document.scrollingElement.scrollWidth <= innerWidth), 'Horizontal overflow');
  assert(await page.locator('h1').evaluateAll(elements => elements.length === 1 && elements[0].textContent.trim().length > 0), 'One readable page heading');
  assert(await page.locator('h1,h2,h3').evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth + 1)), 'Heading text is clipped');
  if (await page.locator('.hero-copy').count()) assert(await page.evaluate(() => {
    const copy = document.querySelector('.hero-copy').getBoundingClientRect(), card = document.querySelector('.hero-product').getBoundingClientRect();
    return copy.right <= card.left + 1 || card.right <= copy.left + 1 || copy.bottom <= card.top + 1 || card.bottom <= copy.top + 1;
  }), 'Hero copy and example do not overlap');
}

async function checkAgreement(page) {
  const agreement = page.locator('#trust');
  const text = normalize(await agreement.textContent());
  const introduction = normalize(await agreement.locator('#start').textContent());
  assert(/conversation history/i.test(introduction) && /said/i.test(introduction) && /building|planned|design/i.test(introduction) && /agreed|decided/i.test(introduction) && /version/i.test(introduction), 'Agreement distinction is framed as planned and distinguishes conversation recall from agreed decisions and versions');
  for (const scope of ['positioning', 'pricing', 'budget', 'dependencies', 'launch gates']) assert(text.toLowerCase().includes(scope), `Shared direction includes ${scope}`);
  assert(/commitments/i.test(text) && /accepted|acceptance/i.test(text) && /follow.through/i.test(text), 'Shared direction supports active coordination of accepted commitments, not only recall');
  const benefits = agreement.locator('.trust-grid article');
  assert.equal(await benefits.count(), 3);
  const people = normalize(await benefits.nth(0).textContent());
  assert(/people/i.test(people) && /accepted|acceptance/i.test(people) && /commitments/i.test(people) && /unresolved|unanswered/i.test(people) && /owners.*accept/i.test(people), 'People can distinguish accepted work from unresolved decisions and owner acceptance');
  const agents = normalize(await benefits.nth(1).textContent());
  assert(/permit/i.test(agents) && /agent/i.test(agents) && /would|planned|design/i.test(agents) && /approved/i.test(agents) && /version/i.test(agents) && /sources?/i.test(agents) && /missing|unknown|unanswered/i.test(agents), 'Permitted agent reads are planned, use approved version and source context, and preserve unanswered questions');
  const authority = normalize(await benefits.nth(2).textContent());
  assert(/read access.*no.*action.*approval authority/i.test(authority), 'Reading grants neither action nor approval authority');
  assert(/people.*decisions.*approvals/i.test(authority) && /owners.*accept.*work.*dates/i.test(authority), 'Human decisions and required approvals remain distinct from exact owner acceptance');
  const maturity = normalize(await agreement.locator('.scope-line').last().textContent());
  assert(/agent/i.test(maturity) && /design|intended|planned|building/i.test(maturity) && /sources/i.test(maturity) && /permissions/i.test(maturity), 'Agent consultation is design intent subject to agreed pilot sources and permissions');

  const detail = page.locator('#agreement-change');
  assert(await detail.evaluate(element => element instanceof HTMLDetailsElement), 'Amendment uses a native disclosure');
  assert.equal(await detail.evaluate(element => element.open), false, 'Amendment starts collapsed');
  const summary = detail.locator('summary');
  assert(await detail.locator('dl').isHidden(), 'Collapsed amendment content is hidden');
  await summary.click();
  assert(await detail.evaluate(element => element.open), 'Pointer opens the amendment');
  assert(await detail.locator('dl').isVisible(), 'Expanded amendment content is visible');
  const amendment = normalize(await detail.innerText());
  assert(/illustrative.*Northstar/i.test(amendment), 'Amendment is explicitly illustrative');
  assert(/version.*approved/i.test(amendment) && /propos/i.test(amendment) && /does not.*(?:change|replace).*accepted work/i.test(amendment), 'A proposal does not silently replace current approval or accepted work');
  assert(/decision approval.*not.*(?:delivery|owner) acceptance/i.test(amendment), 'Decision approval is distinct from owner delivery acceptance');
  assert(/takes effect/i.test(amendment) && /superseded.*scope/i.test(amendment) && /unchanged.*still apply/i.test(amendment) && /awaiting acceptance.*open/i.test(amendment), 'Effective amendments supersede only their scope and leave missing acceptance open');
  assert(/source/i.test(amendment) && /observation window/i.test(amendment) && /stale.*missing.*not proof/i.test(amendment), 'Old or absent evidence is not counted as a successful result');
  assert(await detail.locator('summary,dt,dd').evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth + 1)), 'Expanded amendment text is not horizontally clipped');
  await summary.focus();
  await summary.press('Enter');
  assert.equal(await detail.evaluate(element => element.open), false, 'Keyboard closes the native amendment');
  assert(await detail.locator('dl').isHidden(), 'Closing the amendment hides its content again');
}

try {
  for (const file of ['index.html', 'b.html']) for (const width of [400, 1100]) for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' });
    const errors = recordErrors(page);
    await page.goto(new URL(file, base).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.hero-galaxy').evaluate(image => image.decode());
    assert.equal(await page.locator('h1').textContent(), headline);
    const heroText = normalize(await page.locator('.hero').innerText());
    assert.equal((heroText.match(/AI (?:GTM|go-to-market) program manager/gi) || []).length, 1, 'Category appears once in the hero');
    assert(/50\s*(?:to|[–-])\s*300/i.test(heroText) && /software/i.test(heroText), 'The intended company size and audience appear early');
    assert(/product/i.test(heroText) && /GTM|go-to-market/i.test(heroText));
    const heroCard = normalize(await page.locator('.hero-card').innerText());
    assert(/commitment/i.test(heroCard) && /owner|Product|GTM|Support/i.test(heroCard), 'Hero example starts with accountable commitments');
    assert(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}\b/.test(heroCard), 'Illustrative commitments have concrete dates with weekdays');
    assert(/gate/i.test(heroCard) && /missing|pending|open|unanswered|unconfirmed|not yet|awaiting/i.test(heroCard), 'Hero makes the unanswered gate or acceptance visible');
    assert(/accept|confirm/i.test(heroCard), 'Draft work is distinguished from owner acceptance');
    const earlyBenefits = normalize(await page.locator('#roles').innerText());
    assert(/people/i.test(earlyBenefits) && /permitted agents/i.test(earlyBenefits) && /would/i.test(earlyBenefits), 'People and permitted-agent benefits appear early as intended capabilities');
    const bodyText = await page.locator('body').innerText();
    assert.equal((bodyText.match(/prelaunch/gi) || []).length, 1, 'One clear homepage Prelaunch disclosure');
    assert.equal(await page.locator('.legacy-model,#reader-receipt,#attention-model,#cmp,video,.hero-film-stage').count(), 0, 'Removed simulator, receipt and video are absent');
    assert(await page.evaluate(() => typeof globalThis.model === 'undefined'), 'Archived calculator is not injected into the homepage');
    assert.equal(await page.locator('form').count(), 0);
    assert.equal(await page.locator('.dependency-map-rows article').count(), 7);
    const scenario = normalize(await page.locator('#moments').innerText());
    assert(/Northstar/.test(scenario) && /illustrative/i.test(scenario));
    const program = normalize((await page.locator('#moments,#how,#trust').allTextContents()).join(' '));
    assert(/commitment/i.test(scenario) && /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}\b/.test(scenario), 'Main example forms dated commitments rather than only handling a feature slip');
    assert(/dependenc/i.test(program) && /gate/i.test(program), 'Program connects commitments to dependencies and launch gates');
    assert(/check.in/i.test(program) && /owner/i.test(program), 'Program includes targeted owner check-ins');
    assert(/market|customer/i.test(program) && /evidence|notes|responses|feedback/i.test(program) && /assumption|hypothesis|\bbet\b/i.test(program), 'Learning considers market evidence against the original assumption');
    assert(/human|people|Product/i.test(program) && /decid|judgment|taste/i.test(program), 'People retain judgment and decision authority');
    assert(/accept|confirm/i.test(program) && /next|follow.through|revised/i.test(program), 'The next decision leads to owner-confirmed follow-through');
    assert(/release owner/i.test(program) && /go\/no.go|go or no.go|go.ahead/i.test(program), 'Launch release authority remains explicit');
    assert(/export/i.test(scenario) && /Security/.test(scenario) && /held|blocked|clearance/i.test(scenario), 'Supporting export detail retains its Security gate');
    await checkHeadings(page);
    await checkNavigation(page);
    await checkCTA(page, true);
    const contrast = await measureHeroContrast(page);
    contrastLog.push({ file, width, colorScheme, ...contrast });
    assert(contrast.minimum >= 4.5, `Hero contrast ${contrast.minimum.toFixed(2)} below 4.5:1`);
    const heroImage = page.locator('.hero-galaxy');
    assert.equal(await heroImage.getAttribute('loading'), 'eager');
    assert.equal(await heroImage.getAttribute('fetchpriority'), 'high');
    assert.equal(await heroImage.evaluate(image => getComputedStyle(image).objectFit), 'contain', 'Protected complete hero photograph remains contained');
    assert(/landscape-(1600|1200)\.webp/.test(await heroImage.evaluate(image => image.currentSrc)), 'Protected responsive landscape is used below 1200px');
    assert(await page.evaluate(() => [...document.querySelectorAll('link[rel="preload"][as="image"]')].some(link => matchMedia(link.media).matches && new URL(link.href).href === document.querySelector('.hero-galaxy').currentSrc && link.imageSrcset && link.imageSizes)), 'Hero preload matches its responsive source');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/site-v5/screenshots/${prefix}${file === 'index.html' ? 'a' : 'b'}-${width}-${colorScheme}-hero.png` });
    const affected = page.locator('.hero a[data-open-detail]');
    await affected.click();
    assert.equal(new URL(page.url()).hash, '#launch-dependencies');
    assert(await page.locator('#launch-dependencies').evaluate(element => element.open));
    assert(await page.locator('#launch-dependencies article').first().isVisible());
    await page.locator('.hero a[data-focus-target]').click();
    assert.equal(new URL(page.url()).hash, '#next-decision');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'next-decision');
    assert(await page.locator('#next-decision').isVisible());
    const contact = normalize(await page.locator('#pilot').innerText());
    assert(/no (?:prep|preparation).*documents? needed/i.test(contact));
    assert(/does not send a message or confirm delivery/i.test(contact));
    await checkAgreement(page);
    await checkImages(page);
    assert.deepEqual(checkCopy(await page.locator('body').innerText(), `${file} rendered`), []);
    await checkLinks(page);
    await checkFocus(page);
    await page.getByRole('button', { name: 'Copy address' }).first().click();
    await page.waitForFunction(() => [...document.querySelectorAll('.copy-status')].some(element => element.textContent.length > 0));
    await page.locator('.copy-status').evaluateAll(elements => elements.forEach(element => element.textContent = ''));
    await page.locator('details').evaluateAll(elements => elements.forEach(element => element.open = false));
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/site-v5/screenshots/${prefix}${file === 'index.html' ? 'a' : 'b'}-${width}-${colorScheme}.png`, fullPage: true });
    assert.deepEqual(errors, [], 'Browser console/runtime errors');
    log.push(`PASS ${file} ${width}px ${colorScheme}: audience/category/prelaunch, illustrative dated commitments, launch-to-learning loop, human and permitted-agent agreement/version context, separate read/decision/acceptance authority, native amendment open/close, protected hero photo, visible CTA, working hero anchors, navigation, copy address, images/links/focus and no forms, simulator, receipt or video.`);
    await page.close();
  }

  for (const file of ['index.html', 'use-cases.html', 'pilot-evidence.html']) for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = recordErrors(page);
    await page.goto(new URL(file, base).href);
    await page.evaluate(() => document.fonts.ready);
    await checkHeadings(page);
    await checkNavigation(page);
    await checkCTA(page);
    if (file === 'index.html') await checkAgreement(page);
    assert.equal(await page.locator('form').count(), 0);
    if (file !== 'index.html') {
      const text = await page.locator('main').innerText();
      assert(!/exact feasible commitments|last useful action time|pinned original|human rescue|permission-filtered views/i.test(text), 'Supporting pages use plain language');
      assert.deepEqual(checkCopy(text, `${file} rendered`), []);
    }
    await checkImages(page);
    await checkLinks(page);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/site-v5/screenshots/${prefix}responsive-${file.replace('.html', '')}-${width}.png` });
    assert.deepEqual(errors, [], 'Responsive page errors');
    await page.close();
  }
  log.push('PASS 320/375/768/1024/1440/1920px sweep on home, Launch example and How we’ll measure: overflow, headings/nav, CTA, images and links/anchors, plus readable native agreement disclosure on home.');

  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 400, height: 900 } });
  await noJS.goto(base.href);
  assert(await noJS.locator('.hero a[href^="mailto:ed@coordinatedai.ai"]').isVisible());
  assert.equal(await noJS.locator('form,video,.legacy-model,#reader-receipt').count(), 0);
  await noJS.close();
  log.push('PASS no-JavaScript email fallback.');
  if (!process.env.SKIP_OG_RENDER) {
    const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await og.goto(new URL('og.html', base).href);
    await og.evaluate(() => document.fonts.ready);
    await og.screenshot({ path: `docs/site-v5/screenshots/${prefix}og-review.png` });
    await og.close();
    log.push('PASS OG review screenshot captured without changing a published image asset.');
  } else log.push('PASS existing OG image left unchanged.');
  const privacy = await browser.newPage();
  await privacy.goto(new URL('privacy.html', base).href);
  const privacyText = await privacy.locator('body').innerText();
  assert(!/regular security assessments|industry-standard security|encryption of sensitive data|account is active|reading-receipt code/i.test(privacyText));
  assert(privacyText.includes('Coordinated is prelaunch'));
  await privacy.close();
  log.push('PASS privacy matches the current website/enquiry scope and removed receipt. Archived calculator preservation is checked by check:references.');
} catch (error) {
  log.push(`FAIL ${error.stack}`);
  throw error;
} finally {
  await browser.close();
  await writeFile(`docs/site-v5/logs/${prefix}playwright.log`, log.join('\n') + '\n');
  await writeFile(`docs/site-v5/logs/${prefix}hero-contrast.json`, JSON.stringify(contrastLog, null, 2) + '\n');
  console.log(log.join('\n'));
}
