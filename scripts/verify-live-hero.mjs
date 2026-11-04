import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Captured from the public live hero at this exact commit. Fixtures are inline
// so this helper remains usable without the original screenshot directory.
const baseline = {
  "sourceCommit": "a9db33408f81ffaefa8f54ef206a6622950e7bf4",
  "styles": {
    "hero": {
      "position": "relative",
      "min-height": "940px",
      "background": "rgb(0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
      "color": "rgb(251, 251, 248)",
      "overflow": "hidden"
    },
    "layout": {
      "display": "grid",
      "position": "relative",
      "gap": "64px",
      "grid-template-columns": "498.938px 449.062px",
      "align-items": "start",
      "padding": "90px 0px 80px",
      "margin": "0px 44px"
    },
    "media": {
      "position": "absolute",
      "aspect-ratio": "9 / 5",
      "opacity": "1",
      "transform": "matrix(1, 0, 0, 1, -550, 0)",
      "margin": "0px",
      "mask-image": "linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0) 8%, rgb(0, 0, 0) 92%, rgba(0, 0, 0, 0))"
    },
    "scrim": {
      "display": "none"
    },
    "copy": {
      "width": "498.938px",
      "position": "relative",
      "opacity": "1",
      "background": "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
      "padding": "0px",
      "z-index": "2"
    },
    "headline": {
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "57.2px",
      "font-weight": "500",
      "line-height": "56.628px",
      "letter-spacing": "-3.146px",
      "margin": "0px 0px 28px",
      "color": "rgb(251, 251, 248)",
      "text-align": "start",
      "max-width": "720px"
    },
    "eyebrow": {
      "font-family": "\"JetBrains Mono\", ui-monospace, monospace",
      "font-size": "11px",
      "font-weight": "500",
      "line-height": "17.6px",
      "letter-spacing": "0.66px",
      "margin": "0px 0px 18px",
      "color": "rgba(251, 251, 248, 0.64)"
    },
    "promise": {
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "17px",
      "font-weight": "400",
      "line-height": "26.35px",
      "letter-spacing": "normal",
      "margin": "0px 0px 22px",
      "color": "rgba(251, 251, 248, 0.74)",
      "max-width": "620px"
    },
    "agent": {
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "16px",
      "font-weight": "400",
      "line-height": "25.6px",
      "letter-spacing": "normal",
      "margin": "0px 0px 16px",
      "color": "rgb(251, 251, 248)",
      "max-width": "none"
    },
    "proof": {
      "font-family": "\"JetBrains Mono\", ui-monospace, monospace",
      "font-size": "11px",
      "font-weight": "400",
      "line-height": "17.6px",
      "letter-spacing": "normal",
      "margin": "20px 0px 30px",
      "color": "rgb(184, 188, 196)",
      "max-width": "356.4px"
    },
    "actions": {
      "display": "flex",
      "gap": "10px 20px",
      "align-items": "center",
      "margin": "0px",
      "padding": "0px"
    },
    "product": {
      "position": "relative",
      "margin": "345px 0px 0px",
      "padding": "0px",
      "opacity": "1",
      "top": "0px",
      "right": "0px"
    },
    "card": {
      "color": "rgb(22, 24, 29)",
      "background": "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box",
      "border": "1px solid rgb(217, 221, 228)",
      "border-radius": "10px",
      "padding": "20px",
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "16px",
      "line-height": "25.6px"
    },
    "cardTitle": {
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "18px",
      "font-weight": "600",
      "line-height": "22.5px",
      "letter-spacing": "-0.36px",
      "margin": "0px 0px 11px",
      "color": "rgb(22, 24, 29)"
    },
    "primary": {
      "display": "flex",
      "font-family": "\"JetBrains Mono\", ui-monospace, monospace",
      "font-size": "12px",
      "font-weight": "500",
      "line-height": "15.6px",
      "letter-spacing": "normal",
      "padding": "12px 20px",
      "border": "1px solid rgba(0, 0, 0, 0)",
      "border-radius": "2px",
      "color": "rgb(22, 24, 29)",
      "background": "rgb(251, 251, 248) none repeat scroll 0% 0% / auto padding-box border-box",
      "min-height": "50px"
    },
    "secondary": {
      "display": "flex",
      "font-family": "\"JetBrains Mono\", ui-monospace, monospace",
      "font-size": "12px",
      "font-weight": "500",
      "line-height": "19.2px",
      "letter-spacing": "normal",
      "padding": "0px",
      "border": "0px none rgb(251, 251, 248)",
      "border-radius": "0px",
      "color": "rgb(251, 251, 248)",
      "background": "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
      "min-height": "44px"
    },
    "cardAction": {
      "font-family": "Inter, ui-sans-serif, sans-serif",
      "font-size": "10px",
      "font-weight": "400",
      "line-height": "16px",
      "letter-spacing": "normal",
      "padding": "7px 9px",
      "border": "1px solid rgb(215, 219, 226)",
      "border-radius": "5px",
      "color": "rgb(22, 24, 29)",
      "background": "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box"
    }
  },
  "mobileOverrides": {
    "hero": {
      "min-height": "0px"
    },
    "layout": {
      "gap": "40px",
      "grid-template-columns": "360px",
      "padding": "56px 0px 72px",
      "margin": "0px 20px"
    },
    "media": {
      "position": "relative",
      "transform": "none",
      "margin": "0px -20px"
    },
    "copy": {
      "width": "360px"
    },
    "headline": {
      "font-size": "48px",
      "line-height": "47.52px",
      "letter-spacing": "-2.64px"
    },
    "actions": {
      "gap": "8px",
      "align-items": "flex-start"
    },
    "product": {
      "margin": "-20px 0px 0px"
    }
  },
  "viewports": {
    "400": {
      "headerHeight": 129.59375,
      "rects": {
        "hero": {
          "x": 0,
          "y": 129.59375,
          "width": 400,
          "height": 1575.625
        },
        "copy": {
          "x": 20,
          "y": 185.59375,
          "width": 360,
          "height": 576.3125
        },
        "headline": {
          "x": 20,
          "y": 221.1875,
          "width": 360,
          "height": 95.03125
        },
        "media": {
          "x": 0,
          "y": 801.90625,
          "width": 400,
          "height": 222.21875
        },
        "product": {
          "x": 20,
          "y": 1044.125,
          "width": 360,
          "height": 589.09375
        },
        "primary": {
          "x": 20,
          "y": 659.90625,
          "width": 214.8125,
          "height": 50
        },
        "secondary": {
          "x": 20,
          "y": 717.90625,
          "width": 152.046875,
          "height": 44
        }
      },
      "content": {
        "headline": "Give your team its focus back.",
        "eyebrow": "AN AI PROGRAM MANAGER IN SLACK",
        "promise": "Coordinated is a shared record of your decisions, guardrails and plan, so people and agents work from what has been agreed, without you having to repeat every decision or chase every update.",
        "agent": "Your people read it on Monday. We are building the read contract your agents will use before they act.",
        "proof": "Every message says why it was sent and what it cost you.",
        "cardTitle": "Staging may slip: Thu Oct 1 → Sat Oct 10",
        "primary": "Discuss a six-week pilot",
        "secondary": "See a sample record\n→",
        "cardAction": "Thu Oct 15 still works"
      }
    },
    "1100": {
      "headerHeight": 84,
      "rects": {
        "hero": {
          "x": 0,
          "y": 84,
          "width": 1100,
          "height": 940
        },
        "copy": {
          "x": 44,
          "y": 174,
          "width": 498.9375,
          "height": 490.59375
        },
        "headline": {
          "x": 44,
          "y": 209.59375,
          "width": 498.9375,
          "height": 113.25
        },
        "media": {
          "x": 0,
          "y": 124,
          "width": 1100,
          "height": 611.109375
        },
        "product": {
          "x": 606.9375,
          "y": 519,
          "width": 449.0625,
          "height": 424.8125
        },
        "primary": {
          "x": 44,
          "y": 614.59375,
          "width": 214.8125,
          "height": 50
        },
        "secondary": {
          "x": 278.8125,
          "y": 617.59375,
          "width": 152.046875,
          "height": 44
        }
      },
      "content": {
        "headline": "Give your team its focus back.",
        "eyebrow": "AN AI PROGRAM MANAGER IN SLACK",
        "promise": "Coordinated is a shared record of your decisions, guardrails and plan, so people and agents work from what has been agreed, without you having to repeat every decision or chase every update.",
        "agent": "Your people read it on Monday. We are building the read contract your agents will use before they act.",
        "proof": "Every message says why it was sent and what it cost you.",
        "cardTitle": "Staging may slip: Thu Oct 1 → Sat Oct 10",
        "primary": "Discuss a six-week pilot",
        "secondary": "See a sample record\n→",
        "cardAction": "Thu Oct 15 still works"
      }
    }
  }
};
const base = process.env.BASE_URL || 'http://127.0.0.1:4189';
const out = process.env.HERO_VERIFY_OUT || 'preview-review/content-live-hero/preview-checks';
const selectors = {
  hero: 'section.hero', layout: '.hero-layout', media: '.hero-media', scrim: '.hero-scrim',
  copy: '.hero-copy', headline: '.hero-copy h1', eyebrow: '.hero-copy .eyebrow',
  promise: '.hero-copy .hero-promise', agent: '.hero-copy .agent-line', proof: '.hero-copy .proof-line',
  actions: '.hero-actions', product: '.hero-product', card: '.hero-card',
  cardTitle: '.hero-card h2', primary: '.hero-actions > a:first-child',
  secondary: '.hero-actions > a:nth-child(2)', cardAction: '.hero-card .card-actions > :first-child'
};
const assets = [
  ['assets/galaxy/landscape-1200.webp', 78136, '251ab3d014d02afaef2eb091b315330c00ce37c514bc211266e9757377ed7d6f'],
  ['assets/galaxy/landscape-1600.webp', 111938, '1e24f709281a934f7fa1f8b52abdf6303b131e939c5cf5488989e62b36343925'],
  ['assets/galaxy/landscape-upscaled-2880x1600.webp', 195220, '80772c332bd4fb72a6dea3b5a946f707b023515e3f4b12bf0a85ac07210b6055'],
  ['brand/mark_dark.svg', 481, 'dcaecfd37068e2a2264f65099d56553945e83b7d514a15be13f3437a943616b6'],
  ['fonts.css', 1786, 'bb6174f7c9c94f2a4371c6a23b7fe0073db3218cc3a5a41a9763d8c77cb8a294']
];
const expectedMedia = {
  tag: 'div', attrs: { 'aria-hidden': 'true', class: 'hero-media' }, children: [{
    tag: 'picture', attrs: {}, children: [
      { tag: 'source', attrs: { media: '(max-width: 600px)', srcset: 'assets/galaxy/landscape-1200.webp' }, children: [] },
      { tag: 'source', attrs: { media: '(max-width: 1199px)', srcset: 'assets/galaxy/landscape-1600.webp' }, children: [] },
      { tag: 'img', attrs: { alt: '', class: 'hero-galaxy', fetchpriority: 'high', height: '1600', loading: 'eager', src: 'assets/galaxy/landscape-upscaled-2880x1600.webp', width: '2880' }, children: [] }
    ]
  }]
};
await mkdir(out, { recursive: true });
const checks = [], observations = [], failures = [];
function check(name, passed, detail) {
  const row = { name, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) };
  checks.push(row); if (!row.passed) failures.push(row);
}
function near(name, actual, expected, tolerance = .6) {
  check(name, Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance, { actual, expected, tolerance });
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
try {
  const assetContext = await browser.newContext();
  for (const [path, bytes, hash] of assets) {
    const r = await assetContext.request.get(new URL(path, base).href);
    const data = await r.body(), actualHash = createHash('sha256').update(data).digest('hex');
    check('Exact live asset ' + path, r.status() === 200 && data.length === bytes && actualHash === hash, { status: r.status(), bytes: data.length, expectedBytes: bytes, sha256: actualHash, expectedSha256: hash });
  }
  await assetContext.close();
  for (const width of [1100, 400]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const requests = [], pageErrors = [], consoleErrors = [], failedRequests = [], httpErrors = [];
    page.on('request', r => requests.push({ url: r.url(), method: r.method() }));
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('requestfailed', r => failedRequests.push({ url: r.url(), failure: r.failure() }));
    page.on('response', r => { if (r.status() >= 400) httpErrors.push({ url: r.url(), status: r.status() }); });
    const response = await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator(selectors.hero).waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('.hero img')].map(img => img.decode().catch(() => {})));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: out + '/preview-' + width + '-viewport.png' });
    await page.screenshot({ path: out + '/preview-' + width + '-fullpage.png', fullPage: true });
    const styles = structuredClone(baseline.styles);
    if (width === 400) for (const [role, props] of Object.entries(baseline.mobileOverrides)) Object.assign(styles[role], props);
    const actual = await page.evaluate(({ selectors, styles }) => {
      const rect = e => { const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
      const shape = e => ({ tag: e.tagName.toLowerCase(), attrs: Object.fromEntries([...e.attributes].map(a => [a.name, a.value])), children: [...e.children].map(shape) });
      const roles = {};
      for (const [role, selector] of Object.entries(selectors)) {
        const e = document.querySelector(selector);
        if (!e) { roles[role] = null; continue; }
        const s = getComputedStyle(e);
        roles[role] = { tag:e.tagName, class:e.className, id:e.id, text:e.innerText, href:e.getAttribute('href'), rect:rect(e), style:Object.fromEntries(Object.keys(styles[role]).map(p => [p,s.getPropertyValue(p)])) };
      }
      const hero = document.querySelector(selectors.hero), media = hero.querySelector('.hero-media'), image = media?.querySelector('img'), copy = hero.querySelector('.hero-copy');
      const pseudo = getComputedStyle(copy, '::before');
      const headline = hero.querySelector('h1'), range = document.createRange(); range.selectNodeContents(headline);
      const lineTops = [...new Set([...range.getClientRects()].filter(r => r.width > 0 && r.height > 0).map(r => Math.round(r.top)))];
      const nodes = [...headline.querySelectorAll('*')].map(e => ({tag:e.tagName,class:e.className,text:e.textContent,fontFamily:getComputedStyle(e).fontFamily,whiteSpace:getComputedStyle(e).whiteSpace}));
      const header = document.querySelector('body > header') || document.querySelector('.site-header') || document.querySelector('header');
      return {
        url:location.href, roles, mediaShape:media ? shape(media) : null,
        heroChildren:[...hero.querySelector('.hero-layout').children].map(e => ({tag:e.tagName.toLowerCase(),class:e.className})),
        copyChildren:[...copy.children].map(e => ({tag:e.tagName.toLowerCase(),class:e.className})),
        image:image ? {currentSrc:image.currentSrc,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,fit:getComputedStyle(image).objectFit,position:getComputedStyle(image).objectPosition,opacity:getComputedStyle(image).opacity,rect:rect(image)} : null,
        copyBefore:{display:pseudo.display,position:pseudo.position,backgroundColor:pseudo.backgroundColor,top:pseudo.top,right:pseudo.right,bottom:pseudo.bottom,left:pseudo.left,maskImage:pseudo.maskImage,maskComposite:pseudo.maskComposite,zIndex:pseudo.zIndex,pointerEvents:pseudo.pointerEvents},
        headlineLineCount:Math.round(headline.getBoundingClientRect().height / parseFloat(getComputedStyle(headline).lineHeight)),headlineRangeLineTops:lineTops,headlineDescendants:nodes,headerRect:header ? rect(header) : null,
        headerLinks:header ? [...header.querySelectorAll('a')].filter(e => { const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0; }).map(e=>({text:e.innerText,href:e.getAttribute('href'),rect:rect(e)})) : [],
        content:[...copy.querySelectorAll('h1,p,a')].map(e => ({tag:e.tagName,class:e.className,text:e.innerText,href:e.getAttribute('href')})),
        videoCount:document.querySelectorAll('video,.hero-film-stage,.hero-film-controls').length,
        overflow:document.scrollingElement.scrollWidth > innerWidth,
        interLoaded:document.fonts.check('500 48px Inter')
      };
    }, { selectors, styles });
    const prefix = width + 'px: ';
    check(prefix + 'HTTP 200', response.status() === 200, response.status());
    check(prefix + 'no video or experiment UI/requests', actual.videoCount === 0 && !requests.some(r => /hero-film|\.(mp4|webm)(?:[?#]|$)/.test(r.url)));
    check(prefix + 'no horizontal overflow', !actual.overflow);
    check(prefix + 'Inter font loaded', actual.interLoaded);
    check(prefix + 'no page/console/network errors', !pageErrors.length && !consoleErrors.length && !failedRequests.length && !httpErrors.length, {pageErrors,consoleErrors,failedRequests,httpErrors});
    check(prefix + 'GET requests only', requests.every(r => r.method === 'GET'), requests.filter(r => r.method !== 'GET'));
    check(prefix + 'exact media DOM (ignoring whitespace/attribute order)', JSON.stringify(stable(actual.mediaShape)) === JSON.stringify(stable(expectedMedia)));
    check(prefix + 'live hero child structure/classes', JSON.stringify(actual.heroChildren) === JSON.stringify([{tag:'div',class:'hero-media'},{tag:'div',class:'hero-scrim'},{tag:'div',class:'hero-copy'},{tag:'div',class:'hero-product'}]), actual.heroChildren);
    const expectedSrc = new URL('assets/galaxy/landscape-' + (width === 400 ? '1200' : '1600') + '.webp', base).href;
    check(prefix + 'responsive image currentSrc', actual.image?.currentSrc === expectedSrc, {actual:actual.image?.currentSrc,expected:expectedSrc});
    check(prefix + 'photo containment and opacity', actual.image?.fit === 'contain' && actual.image?.position === '50% 50%' && actual.image?.opacity === '1', actual.image);
    for (const [role, expected] of Object.entries(styles)) {
      if (!actual.roles[role]) {
        if (['agent','proof','eyebrow','promise','cardAction'].includes(role)) observations.push({width,role,note:'Original copy/action slot absent or renamed; inspect as intentional content change.'});
        else check(prefix + 'required component ' + role, false);
        continue;
      }
      for (const [property, value] of Object.entries(expected)) check(prefix + role + ' style ' + property, actual.roles[role].style[property] === value, actual.roles[role].style[property] === value ? undefined : {actual:actual.roles[role].style[property],expected:value});
    }
    const b = baseline.viewports[String(width)].rects;
    const r = actual.roles, photo = actual.image.rect;
    near(prefix + 'photo full viewport width', photo.width, width);
    near(prefix + 'photo 9:5 height', photo.height, width * 5 / 9);
    near(prefix + 'photo horizontal origin', photo.x, 0);
    near(prefix + 'copy horizontal origin', r.copy.rect.x, b.copy.x);
    near(prefix + 'copy column width', r.copy.rect.width, b.copy.width);
    near(prefix + 'copy top relative hero', r.copy.rect.y-r.hero.rect.y, b.copy.y-b.hero.y);
    near(prefix + 'card horizontal origin', r.product.rect.x, b.product.x);
    near(prefix + 'card column width', r.product.rect.width, b.product.width);
    near(prefix + 'header height', actual.headerRect?.height, baseline.viewports[String(width)].headerHeight);
    check(prefix + 'visible header links within viewport', actual.headerLinks.every(e=>e.rect.x>=-.6 && e.rect.x+e.rect.width<=width+.6), actual.headerLinks.filter(e=>e.rect.x<-.6 || e.rect.x+e.rect.width>width+.6));
    if (width === 1100) {
      near(prefix + 'photo top relative hero', photo.y-r.hero.rect.y, b.media.y-b.hero.y);
      near(prefix + 'card top relative hero', r.product.rect.y-r.hero.rect.y, b.product.y-b.hero.y);
      const p = actual.copyBefore;
      check(prefix + 'live desktop copy shading', p.display === 'block' && p.backgroundColor === 'rgba(0, 0, 0, 0.78)' && p.position === 'absolute' && [p.top,p.right,p.bottom,p.left].every(v=>v==='-64px') && p.maskComposite.split(',').every(v=>v.trim()==='intersect') && p.maskImage.includes('60px') && p.zIndex === '-1' && p.pointerEvents === 'none', p);
    } else {
      const copyBottom = r.copy.rect.y + r.copy.rect.height, photoBottom = photo.y + photo.height;
      check(prefix + 'mobile order copy then photo then card', copyBottom <= photo.y && photoBottom <= r.product.rect.y);
      near(prefix + 'photo gap after copy', photo.y-copyBottom, 40);
      near(prefix + 'card gap after photo', r.product.rect.y-photoBottom, 20);
      check(prefix + 'mobile copy shading hidden', actual.copyBefore.display === 'none', actual.copyBefore);
    }
    observations.push({width,headline:{before:baseline.viewports[String(width)].content.headline,after:r.headline.text,lineCountBefore:Math.round(b.headline.height / parseFloat(styles.headline['line-height'])),lineCountAfter:actual.headlineLineCount,descendants:actual.headlineDescendants},verticalPositions:{photoBefore:b.media.y,photoAfter:photo.y,cardBefore:b.product.y,cardAfter:r.product.rect.y,copyHeightBefore:b.copy.height,copyHeightAfter:r.copy.rect.height},content:actual.content,note:'Text wrapping and resulting mobile absolute Y/height changes are reported, not asserted equal.'});
    await writeFile(out + '/preview-' + width + '.json',JSON.stringify({actual,requests,pageErrors,consoleErrors,failedRequests,httpErrors},null,2)+'\n');
    await context.close();
  }
} finally { await browser.close(); }
const report = { base, baselineSourceCommit:baseline.sourceCommit, passed:failures.length===0, checks, failures, observations };
await writeFile(out + '/report.json',JSON.stringify(report,null,2)+'\n');
await writeFile(out + '/checks.txt',checks.map(c=>(c.passed?'PASS ':'FAIL ')+c.name+(c.detail && !c.passed?' '+JSON.stringify(c.detail):'')).join('\n')+'\n');
console.log(JSON.stringify({base,passed:report.passed,checks:checks.length,failures,observations},null,2));
if(failures.length) process.exitCode=1;
