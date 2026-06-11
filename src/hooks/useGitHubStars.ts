import { useEffect, useState } from "react";

export const GITHUB_REPO = "Datus-ai/Datus-agent";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

const GITHUB_STARS_FALLBACK = 1248;
const GITHUB_STARS_CACHE_KEY = "datus:github-stars";
const GITHUB_STARS_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/** 1248 -> "1.2k", 12480 -> "12k" */
export const formatStarCount = (count: number): string => {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return thousands >= 10
    ? `${Math.round(thousands)}k`
    : `${thousands.toFixed(1)}k`;
};

/**
 * Live GitHub star count with localStorage caching and a static fallback.
 * Shared between the homepage and the global nav so the social proof is
 * consistent across every page.
 */
export const useGitHubStars = (
  repo: string = GITHUB_REPO,
  fallback: number = GITHUB_STARS_FALLBACK,
): number => {
  const [stars, setStars] = useState<number>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(GITHUB_STARS_CACHE_KEY);
      if (!raw) return fallback;
      const cached = JSON.parse(raw) as { count: number; ts: number };
      if (typeof cached.count === "number") return cached.count;
    } catch {
      // ignore — fall through to fallback
    }
    return fallback;
  });

  useEffect(() => {
    let cancelled = false;

    try {
      const raw = window.localStorage.getItem(GITHUB_STARS_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { count: number; ts: number };
        if (
          typeof cached.ts === "number" &&
          Date.now() - cached.ts < GITHUB_STARS_TTL_MS
        ) {
          return; // cache still fresh; skip fetch
        }
      }
    } catch {
      // ignore cache read errors
    }

    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const count = data.stargazers_count;
        if (typeof count !== "number") return;
        setStars(count);
        try {
          window.localStorage.setItem(
            GITHUB_STARS_CACHE_KEY,
            JSON.stringify({ count, ts: Date.now() }),
          );
        } catch {
          // ignore quota/serialization errors
        }
      })
      .catch(() => {
        // network/rate-limit failure — keep existing value (cache or fallback)
      });

    return () => {
      cancelled = true;
    };
  }, [repo]);

  return stars;
};
