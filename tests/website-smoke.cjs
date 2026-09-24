const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.SITE_BASE_URL || "http://127.0.0.1:4188";
const output =
  process.env.SITE_QA_DIR ||
  path.join(require("node:os").tmpdir(), "coordinated-website-qa");
(async () => {
  await fs.mkdir(output, { recursive: true });
  let launch = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE_PATH)
    launch.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  if (process.env.SITE_CHROMIUM_MODULE) {
    const packaged = (await import(process.env.SITE_CHROMIUM_MODULE)).default;
    launch = {
      ...launch,
      executablePath: await packaged.executablePath(),
      args: packaged.args,
    };
  }
  const browser = await chromium.launch(launch);
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.screenshot({ path: path.join(output, "desktop-hero.png") });
    const next = page.locator("[data-demo-next]");
    const panel = page.locator("[data-demo-panel]");
    await next.click();
    await next.click();
    assert.equal(
      await next.isDisabled(),
      true,
      "response is required to advance",
    );
    await page.locator('[data-demo-response="proposal"]').click();
    const note = "Keep ten days & make <the concern> visible to Nadia.";
    await page.locator("#demo-concern").fill(note);
    await next.click();
    assert.ok(
      (await panel.innerText()).includes(note),
      "exact contributor input reaches decision",
    );
    assert.equal(
      await panel.locator("the").count(),
      0,
      "input is text, not HTML",
    );
    await page.locator('[data-demo-decision="adopt"]').click();
    assert.ok((await panel.innerText()).toLowerCase().includes("v2"));
    assert.ok((await panel.innerText()).includes("Input adopted"));
    await next.click();
    assert.ok((await panel.innerText()).includes("Tue Oct 20"));
    assert.ok(
      (await panel.innerText()).includes("Legal approval is not on record"),
    );
    await page
      .locator(".demo-shell")
      .screenshot({ path: path.join(output, "desktop-review.png") });
    await page.locator('[data-demo-step="2"]').click();
    await page.locator("#demo-concern").fill("A revised concern.");
    assert.equal(
      await page.locator('[data-demo-step="4"]').isDisabled(),
      true,
      "edits invalidate prior decision",
    );
    await page.locator('[data-demo-response="pending"]').click();
    await next.click();
    assert.equal(
      await page.locator('[data-demo-decision="adopt"]').count(),
      0,
      "silence cannot amend terms",
    );
    await page.locator('[data-demo-decision="open"]').click();
    assert.ok((await panel.innerText()).toLowerCase().includes("v1"));
    assert.ok((await panel.innerText()).includes("Response pending"));
    await next.click();
    assert.ok(
      (await panel.innerText()).toLowerCase().includes("2 open questions"),
    );
    assert.ok((await panel.innerText()).includes("spend lock has passed"));
    await page.locator("[data-demo-reset]").click();
    assert.equal(
      await page.locator('[data-demo-step="5"]').isDisabled(),
      true,
      "reset clears reachable decisions",
    );
    await next.click();
    await next.click();
    await page.locator('[data-demo-response="talk"]').click();
    await next.click();
    assert.equal(
      await page.locator('[data-demo-decision="adopt"]').count(),
      0,
      "discussion is not acceptance",
    );
    await page.locator('[data-demo-decision="open"]').click();
    assert.ok((await panel.innerText()).includes("Input unresolved"));
    // Contact preview neither navigates nor makes a lead submission.
    await page.goto(`${base}/pilot.html`);
    const contactRequests = [];
    page.on("request", (req) => {
      if (req.method() !== "GET") contactRequests.push(req.url());
    });
    await page.getByLabel("Your name").fill("Example operator");
    await page.getByLabel("Company").fill("Example company");
    await page.getByLabel("The initiative and").fill("   ");
    await page.getByRole("button", { name: "Preview your email" }).click();
    assert.equal(await page.locator("[data-email-preview]").isVisible(), false);
    await page
      .getByLabel("The initiative and")
      .fill("A launch & customer commitment #1");
    await page.getByRole("button", { name: "Preview your email" }).click();
    assert.equal(await page.locator("[data-email-preview]").isVisible(), true);
    const mail = await page.locator("[data-email-open]").getAttribute("href");
    assert.ok(mail.startsWith("mailto:ed@coordinatedai.ai?"));
    assert.ok(
      decodeURIComponent(mail).includes("A launch & customer commitment #1"),
    );
    assert.ok(
      (await page.locator("[data-email-preview]").innerText()).includes(
        "No message has been sent",
      ),
    );
    assert.equal(contactRequests.length, 0);
    await page.getByLabel("Company").fill("Changed company");
    assert.equal(
      await page.locator("[data-email-preview]").isVisible(),
      false,
      "edits hide stale email",
    );
    await page.screenshot({ path: path.join(output, "desktop-pilot.png") });
    const pages = [
      "index.html",
      "principles.html",
      "pilot.html",
      "pilot-evidence.html",
      "use-cases.html",
    ];
    const viewports = [
      { width: 1440, height: 1000 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 320, height: 812 },
    ];
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const file of pages) {
        const response = await page.goto(`${base}/${file}`);
        assert.equal(response.status(), 200, `${file} loads`);
        assert.equal(await page.locator("h1").count(), 1, `${file} has one h1`);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${file} at ${viewport.width}: no horizontal overflow`,
        );
        assert.equal(
          await page
            .locator("body")
            .innerText()
            .then((t) =>
              /\[PILOT PROOF POINT\]|\[Company\]|\[Operator quote\]/.test(t),
            ),
          false,
          "no proof placeholders",
        );
        assert.equal(
          await page.evaluate(() =>
            [...document.images].some(
              (i) => i.complete && i.naturalWidth === 0,
            ),
          ),
          false,
          "images loaded",
        );
        if (
          viewport.width === 390 &&
          ["index.html", "principles.html", "pilot.html"].includes(file)
        )
          await page.screenshot({
            path: path.join(output, `mobile-${file.replace(".html", "")}.png`),
          });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base);
    await next.click();
    await next.click();
    await page.locator('[data-demo-response="proposal"]').click();
    await page
      .locator(".demo-shell")
      .screenshot({ path: path.join(output, "mobile-demo.png") });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.deepEqual(errors, [], "no browser exceptions");
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto(`${base}/assets/product/og-template.html`);
    await page.locator(".galaxy").evaluate((img) => img.decode());
    await page.screenshot({
      path: path.join(process.cwd(), "assets/product/og-living-plan.png"),
    });
    const nojs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const fallback = await nojs.newPage();
    await fallback.goto(base);
    assert.ok(
      (await fallback.locator("[data-demo-panel]").innerText()).includes(
        "Shipping alone will not prove",
      ),
    );
    await fallback.goto(`${base}/pilot.html`);
    assert.equal(
      await fallback.locator("button[type=submit]").isDisabled(),
      true,
      "no-JS form cannot leak values in a GET",
    );
    assert.ok(
      await fallback
        .getByRole("link", { name: "email Ed directly", exact: true })
        .count(),
    );
    await nojs.close();
    console.log(
      JSON.stringify(
        {
          passed: true,
          viewports: viewports.map((v) => v.width),
          pages,
          checks: [
            "proposal and authorized amendment",
            "missing response stays open",
            "discussion is not acceptance",
            "response edits invalidate decisions",
            "input escapes HTML",
            "reset",
            "email preview and stale draft",
            "no form submission",
            "no-JS fallback",
            "responsive overflow",
            "browser errors",
          ],
          screenshots: output,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
