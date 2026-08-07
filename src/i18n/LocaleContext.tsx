import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, localizePath, type Locale } from "./config";

type LocaleValue = {
  locale: Locale;
  /** The page's English-form path (`/pricing/`), i.e. with no locale prefix. */
  path: string;
};

/**
 * The active locale for the current page.
 *
 * There is exactly one locale per document (each `/zh` page is its own
 * prerendered HTML file), so this never changes after mount — switching
 * language is a full navigation, not a state update. The provider is installed
 * once per entry point: `src/lib/mount.tsx` on the client, `src/prerender.tsx`
 * at build time.
 */
const LocaleContext = createContext<LocaleValue>({ locale: DEFAULT_LOCALE, path: "/" });

export function LocaleProvider({
  locale,
  path,
  children,
}: {
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, path }), [locale, path]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/** The current page's path in its English (unprefixed) form. */
export function useCurrentPath(): string {
  return useContext(LocaleContext).path;
}

/** Pick the active locale's branch out of a copy dictionary. */
export function useT<T>(dict: Record<Locale, T>): T {
  return dict[useLocale()];
}

/** Non-hook form, for module-level helpers that already know the locale. */
export function pick<T>(dict: Record<Locale, T>, locale: Locale): T {
  return dict[locale];
}

/**
 * Returns `l(href)` — the locale-correct form of an internal href.
 *
 * Every internal link in the marketing tree goes through this so a `/zh` page
 * keeps the reader inside `/zh`. Blog links (and anything else without a
 * mirror) pass through unchanged, which is the documented behaviour.
 */
export function useHref(): (href: string) => string {
  const locale = useLocale();
  return useMemo(() => (href: string) => localizePath(href, locale), [locale]);
}
