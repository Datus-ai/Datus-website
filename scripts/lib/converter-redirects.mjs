// GitHub Pages cannot configure an HTTP redirect. Preserve old shared tool URLs
// with an immediate client redirect and a no-JavaScript meta-refresh fallback.
export function converterRedirectStub(target, locale = 'en') {
  const path = new URL(target).pathname;
  const copy = {
    en: { lang: 'en-US', title: 'Converter moved', link: 'Open the Apache Ossie converter' },
    zh: { lang: 'zh-CN', title: '转换器地址已更新', link: '打开 Apache Ossie 转换器' },
  }[locale];
  return `<!doctype html>
<html lang="${copy.lang}"><head><meta charset="UTF-8">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${target}">
<script>location.replace(${JSON.stringify(path)}+location.search+location.hash);</script>
<meta http-equiv="refresh" content="0;url=${path}">
<title>${copy.title}</title></head><body><a href="${target}">${copy.link}</a></body></html>\n`;
}
