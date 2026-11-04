// Recognize search hosts, not arbitrary Google/Yahoo product subdomains.
// Google regional domains: https://www.google.com/supported_domains
const GOOGLE_DOMAINS = new Set([
  'google.com',
  'google.co.uk',
  'google.com.hk',
  'google.co.jp',
  'google.cn',
  'google.com.tw',
  'google.co.kr',
  'google.com.sg',
  'google.co.in',
  'google.com.au',
  'google.co.nz',
  'google.ca',
  'google.de',
  'google.fr',
  'google.es',
  'google.it',
  'google.nl',
  'google.ch',
  'google.at',
  'google.be',
  'google.se',
  'google.no',
  'google.dk',
  'google.fi',
  'google.pl',
  'google.pt',
  'google.ie',
  'google.co.za',
  'google.com.br',
  'google.com.mx',
  'google.com.ar',
  'google.com.tr',
  'google.co.id',
  'google.com.my',
  'google.co.th',
  'google.com.vn',
  'google.com.ph',
  'google.ae',
]);
const SEARCH_HOSTS = new Map<string, string>(
  Object.entries({
    'bing.com': 'bing',
    'www.bing.com': 'bing',
    'cn.bing.com': 'bing',
    'duckduckgo.com': 'duckduckgo',
    'www.duckduckgo.com': 'duckduckgo',
    'search.yahoo.com': 'yahoo',
    'search.yahoo.co.jp': 'yahoo',
    'baidu.com': 'baidu',
    'www.baidu.com': 'baidu',
    'm.baidu.com': 'baidu',
    'sogou.com': 'sogou',
    'www.sogou.com': 'sogou',
    'm.sogou.com': 'sogou',
    'so.com': '360',
    'www.so.com': '360',
    'm.so.com': '360',
    'yandex.com': 'yandex',
    'www.yandex.com': 'yandex',
    'yandex.ru': 'yandex',
    'www.yandex.ru': 'yandex',
    'ya.ru': 'yandex',
    'search.naver.com': 'naver',
    'm.search.naver.com': 'naver',
    'search.brave.com': 'brave',
    'ecosia.org': 'ecosia',
    'www.ecosia.org': 'ecosia',
    'startpage.com': 'startpage',
    'www.startpage.com': 'startpage',
    'qwant.com': 'qwant',
    'www.qwant.com': 'qwant',
  }),
);

// Canonical product hosts keep inferred and explicitly tagged ChatGPT traffic together.
// Other hosts retain their own domain through the generic referral fallback.
const AI_REFERRAL_HOSTS = new Map<string, string>([
  ['chatgpt.com', 'chatgpt.com'],
  ['www.chatgpt.com', 'chatgpt.com'],
  ['chat.openai.com', 'chatgpt.com'],
  ['claude.ai', 'claude.ai'],
  ['www.claude.ai', 'claude.ai'],
  ['perplexity.ai', 'perplexity.ai'],
  ['www.perplexity.ai', 'perplexity.ai'],
  ['gemini.google.com', 'gemini.google.com'],
  ['copilot.microsoft.com', 'copilot.microsoft.com'],
  ['copilot.com', 'copilot.microsoft.com'],
  ['copilot.cloud.microsoft', 'copilot.microsoft.com'],
  ['m365.cloud.microsoft', 'copilot.microsoft.com'],
  ['chat.deepseek.com', 'chat.deepseek.com'],
]);

/** Avoid guessing organic or AI referral traffic when a paid-click identifier is present. */
export function hasPaidClickId(params: URLSearchParams): boolean {
  return ['gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid', 'yclid', 'NaPm'].some(key => params.has(key));
}

/** Use an external referrer domain when a valid explicit source is unavailable. */
export function referrerCampaign(
  referrer: string,
  params: URLSearchParams,
  currentHostname: string,
): { utm_source: string; utm_medium?: 'organic' | 'referral' } | null {
  const hasExplicitUtm = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
    'utm_term', 'utm_id', 'utm_source_platform',
  ].some(key => params.has(key));

  const explicitSource = params.get('utm_source')?.trim();
  const hasValidSource = explicitSource && explicitSource.length <= 100 && !/[\u0000-\u001f\u007f]/.test(explicitSource);

  if (!referrer || hasValidSource) {
    return null;
  }

  try {
    const url = new URL(referrer);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    // Ignore website navigation, including transitions between canonical aliases.
    if (!host || host.length > 100 || host === currentHostname.toLowerCase().replace(/\.$/, '') || host === 'datus.ai' || host === 'www.datus.ai') {
      return null;
    }

    // Partial tags and paid IDs supply no evidence for an inferred medium.
    if (hasExplicitUtm || hasPaidClickId(params)) {
      return { utm_source: host };
    }

    const aiSource = AI_REFERRAL_HOSTS.get(host);

    if (aiSource) {
      return { utm_source: aiSource, utm_medium: 'referral' };
    }

    const googleHost = host.replace(/^www\./, '');
    const source = GOOGLE_DOMAINS.has(googleHost)
      ? 'google'
      : SEARCH_HOSTS.get(host);

    if (source) {
      return { utm_source: source, utm_medium: 'organic' };
    }

    return { utm_source: host, utm_medium: 'referral' };
  } catch {
    // Invalid or unavailable referrers do not interrupt registration.
  }

  return null;
}
