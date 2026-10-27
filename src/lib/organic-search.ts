// Recognize search hosts, not arbitrary Google/Yahoo product subdomains.
// Google regional domains: https://www.google.com/supported_domains
const GOOGLE_DOMAINS = new Set([
  "google.com", "google.co.uk", "google.com.hk", "google.co.jp", "google.cn",
  "google.com.tw", "google.co.kr", "google.com.sg", "google.co.in", "google.com.au",
  "google.co.nz", "google.ca", "google.de", "google.fr", "google.es", "google.it",
  "google.nl", "google.ch", "google.at", "google.be", "google.se", "google.no",
  "google.dk", "google.fi", "google.pl", "google.pt", "google.ie", "google.co.za",
  "google.com.br", "google.com.mx", "google.com.ar", "google.com.tr", "google.co.id",
  "google.com.my", "google.co.th", "google.com.vn", "google.com.ph", "google.ae",
]);
const SEARCH_HOSTS = new Map<string, string>(Object.entries({
  "bing.com": "bing", "www.bing.com": "bing", "cn.bing.com": "bing",
  "duckduckgo.com": "duckduckgo", "www.duckduckgo.com": "duckduckgo",
  "search.yahoo.com": "yahoo", "search.yahoo.co.jp": "yahoo",
  "baidu.com": "baidu", "www.baidu.com": "baidu", "m.baidu.com": "baidu",
  "sogou.com": "sogou", "www.sogou.com": "sogou", "m.sogou.com": "sogou",
  "so.com": "360", "www.so.com": "360", "m.so.com": "360",
  "yandex.com": "yandex", "www.yandex.com": "yandex", "yandex.ru": "yandex", "www.yandex.ru": "yandex", "ya.ru": "yandex",
  "search.naver.com": "naver", "m.search.naver.com": "naver",
  "search.brave.com": "brave",
  "ecosia.org": "ecosia", "www.ecosia.org": "ecosia",
  "startpage.com": "startpage", "www.startpage.com": "startpage",
  "qwant.com": "qwant", "www.qwant.com": "qwant",
}));

/** Avoid guessing organic traffic when a known paid-click identifier is present. */
export function hasPaidClickId(params: URLSearchParams): boolean {
  return ["gclid", "dclid", "gbraid", "wbraid", "msclkid", "yclid", "NaPm"].some(key => params.has(key));
}

export function organicSearchCampaign(referrer: string, params: URLSearchParams): {
  utm_source: string;
  utm_medium: "organic";
} | null {
  if (!referrer || hasPaidClickId(params)) return null;
  try {
    const url = new URL(referrer);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    const googleHost = host.replace(/^www\./, "");
    const source = GOOGLE_DOMAINS.has(googleHost) ? "google" : SEARCH_HOSTS.get(host);
    return source ? { utm_source: source, utm_medium: "organic" } : null;
  } catch {
    return null;
  }
}
