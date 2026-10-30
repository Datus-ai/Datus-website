import { createContext, useEffect, useState } from 'react';

// Deterministic SSR values mirror the light tokens in styles/nordic-site.css.
// After hydration, CSS is the source of truth, including the saved dark choice.
const LIGHT_APPEARANCE = {
  dark: false,
  background: '#f7f7f2',
  surface: '#fffef9',
  panel: '#f7f7f2',
  text: '#252624',
  secondary: '#696b63',
  faint: '#72746d',
  border: '#c9cbc1',
  line: '#dcded4',
  brand: '#402df3',
  accent: '#402df3',
  tint: '#eeebfb',
  green: '#436248',
  cyan: '#176672',
  pink: '#8b3b72',
  warning: '#80601f',
  danger: '#a33b35',
};

export type ConverterAppearance = typeof LIGHT_APPEARANCE;
export const ConverterAppearanceContext = createContext(LIGHT_APPEARANCE);

export function useWebsiteAppearance(): ConverterAppearance {
  const [appearance, setAppearance] = useState(LIGHT_APPEARANCE);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const styles = getComputedStyle(root);
      const color = (name: string) => styles.getPropertyValue(name).trim();
      setAppearance({
        dark: root.dataset.theme === 'dark',
        background: color('--bg'),
        surface: color('--panel-solid'),
        panel: color('--sc-panel'),
        text: color('--ink'),
        secondary: color('--ink-muted'),
        faint: color('--ink-faint'),
        border: color('--line-strong'),
        line: color('--line'),
        brand: color('--brand'),
        accent: color('--brand-bright'),
        tint: color('--brand-soft'),
        green: color('--term-green'),
        cyan: color('--term-cyan'),
        pink: color('--term-pink'),
        warning: color('--sc-warning'),
        danger: color('--sc-danger'),
      });
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    sync();
    return () => observer.disconnect();
  }, []);
  return appearance;
}
