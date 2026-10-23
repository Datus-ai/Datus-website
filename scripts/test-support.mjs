import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { preview } from "vite";
import puppeteer from "puppeteer";

const shots = "/tmp/datus-support-production";
mkdirSync(shots, { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
const browser = await puppeteer.launch({ headless: true });
const scenarios = [
  {
    locale: "en",
    path: "/support/",
    title: "Find answers. Keep moving.",
    quick: "Model errors",
    query: "model",
    close: "Close guide",
    copy: "Copy issue template",
    copied: "Issue template copied.",
    language: "Change language",
    next: "/zh/support/",
  },
  {
    locale: "zh",
    path: "/zh/support/",
    title: "找到答案，继续你的工作。",
    quick: "模型报错",
    query: "模型",
    close: "关闭指南",
    copy: "复制问题模板",
    copied: "问题模板已复制",
    language: "切换语言",
    next: "/support/",
  },
];
try {
  for (const scenario of scenarios) {
    const source = readFileSync(`dist${scenario.path}index.html`, "utf8");
    assert.ok(source.includes(scenario.title), "Body must be prerendered");
    assert.ok(source.includes("Trace ID"), "Guide content must be prerendered");
    const context = await browser.createBrowserContext();
    await context.overridePermissions(base, [
      "clipboard-read",
      "clipboard-write",
    ]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith(base) || request.url().startsWith("data:"))
        return request.continue();
      if (request.url().includes("api.github.com"))
        return request.respond({
          status: 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify({ stargazers_count: 1248 }),
        });
      return request.respond({
        status: 200,
        contentType: "application/javascript",
        body: "",
      });
    });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem(
        "datus_website_cookie_consent",
        JSON.stringify({
          necessary: true,
          analytics: false,
          version: "2026-10-15",
          savedAt: Date.now(),
        }),
      );
    });
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto(`${base}${scenario.path}?review=1`, {
      waitUntil: "networkidle0",
    });
    assert.equal(
      await page.$eval("h1", (el) => el.textContent),
      scenario.title,
    );
    const deploymentRel = await page.$eval(
      'a[href="https://studio.datus.ai/deployment"]',
      (el) => [...el.relList],
    );
    assert.ok(deploymentRel.includes("noopener"));
    assert.ok(!deploymentRel.includes("noreferrer"), "Deployment docs must retain referral attribution");
    const seo = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      canonical: document
        .querySelector("link[rel=canonical]")
        .getAttribute("href"),
      alternates: [
        ...document.querySelectorAll("link[rel=alternate][hreflang]"),
      ].map((el) => [el.hreflang, el.getAttribute("href")]),
      faq: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((el) => JSON.parse(el.textContent))
        .find((item) => item["@type"] === "FAQPage"),
      articles: document.querySelectorAll(".support-guide-dialog article")
        .length,
      questions: [...document.querySelectorAll(".support-faq summary h3")].map(
        (el) => el.textContent,
      ),
      answers: [...document.querySelectorAll(".support-faq .faq__a p")].map(
        (el) => el.textContent,
      ),
      links: [...document.querySelectorAll('.support-page a[href^="/"]')].map(
        (el) => el.getAttribute("href"),
      ),
    }));
    assert.equal(seo.lang, scenario.locale === "en" ? "en-US" : "zh-CN");
    assert.equal(seo.canonical, `https://datus.ai${scenario.path}`);
    assert.deepEqual(Object.fromEntries(seo.alternates), {
      en: "https://datus.ai/support/",
      "zh-Hans": "https://datus.ai/zh/support/",
      "x-default": "https://datus.ai/support/",
    });
    assert.equal(seo.faq["@id"], `https://datus.ai${scenario.path}#faq`);
    assert.equal(seo.faq.mainEntity.length, 6);
    assert.equal(seo.articles, 12);
    assert.deepEqual(
      seo.faq.mainEntity.map((item) => item.name),
      seo.questions,
    );
    assert.deepEqual(
      seo.faq.mainEntity.map((item) => item.acceptedAnswer.text),
      seo.answers.map((answer) => `<p>${answer}</p>`),
    );
    if (scenario.locale === "zh")
      assert.ok(seo.links.every((href) => href.startsWith("/zh/")));
    await page.$$eval("img", (imgs) =>
      Promise.all(imgs.map((img) => img.decode())),
    );
    await page.screenshot({
      path: `${shots}/${scenario.locale}-desktop.png`,
      fullPage: true,
    });

    // Quick search ranks model guides ahead of incidental body matches.
    const quick = await page.$$(".support-quick button");
    await quick[1].click();
    await page.waitForSelector(
      ".support-search-results:not([hidden]) .support-result-item",
    );
    assert.equal(
      await page.$eval(".support-search-form input", (el) => el.value),
      scenario.query,
    );
    const first = await page.$(".support-result-item");
    const expectedTitle = await first.$eval("strong", (el) => el.textContent);
    assert.match(expectedTitle, /model|模型/i);
    await first.click();
    await page.waitForSelector(".support-guide-dialog[open]");
    const modal = await page.$eval(".support-guide-dialog", (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.x + r.width / 2,
        y: r.y + r.height / 2,
        title: el.querySelector("article:not([hidden]) h2").textContent,
        steps: el.querySelectorAll("article:not([hidden]) li").length,
      };
    });
    assert.equal(modal.title, expectedTitle);
    assert.equal(modal.steps, 4);
    assert.ok(Math.abs(modal.x - 720) < 2 && Math.abs(modal.y - 550) < 2);
    await page.screenshot({ path: `${shots}/${scenario.locale}-guide.png` });
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () =>
        !document.querySelector(".support-guide-dialog").open &&
        document.body.style.overflow !== "hidden",
    );
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    assert.equal(
      await page.evaluate(() => document.activeElement?.className),
      "support-result-item",
    );

    // Unknown and HTML-like input stays text and has a useful contact fallback.
    await page.$eval(".support-search-form input", (el) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set;
      setter.call(el, "<script>alert(1)</script>");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForSelector(".support-empty");
    assert.equal(
      await page.$eval(
        ".support-result-list",
        (el) => el.querySelectorAll("script").length,
      ),
      0,
    );
    await page.click(".support-result-head button");
    await page.waitForFunction(
      () => document.querySelector(".support-search-results").hidden,
    );

    // Every topic guide opens and closes the shared modal.
    const guides = await page.$$(".support-article-links button");
    assert.equal(guides.length, 12);
    for (const guide of guides) {
      await guide.click();
      await page.waitForSelector(".support-guide-dialog[open]");
      assert.equal(
        await page.$$eval(
          ".support-guide-dialog article:not([hidden])",
          (els) => els.length,
        ),
        1,
      );
      await page.click(".support-close-button");
      await page.waitForFunction(
        () =>
          !document.querySelector(".support-guide-dialog").open &&
          document.body.style.overflow !== "hidden",
      );
    }
    const summaries = await page.$$(".support-faq summary");
    const previous = await summaries[2].evaluate((el) => el.parentElement.open);
    await summaries[2].click();
    assert.equal(
      await summaries[2].evaluate((el) => el.parentElement.open),
      !previous,
    );
    await summaries[2].click();

    await page.click(".support-request-actions button");
    await page.waitForFunction(
      (prefix) =>
        document.querySelector(".support-toast").textContent.startsWith(prefix),
      {},
      scenario.copied,
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(copied.includes("Trace ID") && copied.includes("\n"));
    // The fallback must give honest failure feedback and leave no hidden field.
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      });
      document.execCommand = () => false;
    });
    await page.click(".support-request-actions button");
    assert.equal(
      await page.$eval(
        ".support-toast",
        (el) =>
          el.textContent.startsWith("Could not copy") ||
          el.textContent.startsWith("复制未完成"),
      ),
      true,
    );
    assert.equal(
      await page.$$eval(".support-clipboard-field", (els) => els.length),
      0,
    );

    // The language switch keeps both path and query string.
    await page.click(".nav-lang");
    const languageLink = await page.$eval(
      `.nav-lang__menu a[data-lang-href="${scenario.next}"]`,
      (el) => el.getAttribute("href"),
    );
    assert.equal(languageLink, `${scenario.next}?review=1`);
    await page.click(".nav-lang");
    await page.waitForFunction(
      () =>
        !document.querySelector(".support-toast").classList.contains("show"),
    );
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewport({ width, height: 1100 });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
        `${scenario.locale} overflow at ${width}`,
      );
      if (width === 390) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `${shots}/${scenario.locale}-mobile.png`,
          fullPage: true,
        });
      }
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${scenario.path}: SSR, SEO, FAQ schema, search, all 12 guides, focus, clipboard, locale switch, responsive layout`,
    );
  }
  const sitemap = readFileSync("dist/sitemap-pages.xml", "utf8");
  assert.ok(
    sitemap.includes("<loc>https://datus.ai/support/</loc>") &&
      sitemap.includes("<loc>https://datus.ai/zh/support/</loc>"),
  );
  const blog = readFileSync("dist/blog/index.html", "utf8");
  assert.ok(blog.includes('href="/support/"'));
  assert.ok(!blog.includes('hreflang="zh-Hans"'));
  assert.ok(!sitemap.includes("/zh/blog/"));
  assert.match(readFileSync("dist/en/support/index.html", "utf8"), /noindex/);
  const redirect = await fetch(`${base}/zh/support`, { redirect: "manual" });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), "/zh/support/");
  console.log(
    `PASS sitemap, blog navigation, English-only blog, /en redirect, clean URL; screenshots: ${shots}`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
