/**
 * Where things live. Credentials, fetched data and reports are kept OUTSIDE
 * the repo (Datus-website is public): $DATUS_SEO_HOME, default ~/.datus-seo-weekly.
 */

import { homedir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import dotenv from 'dotenv';

const here = dirname(fileURLToPath(import.meta.url));

export const SKILL_DIR = resolve(here, '..', '..');
export const REPO_ROOT = resolve(SKILL_DIR, '..', '..', '..');
export const REGISTRY_DIR = join(SKILL_DIR, 'registries');

export const SEO_HOME = resolve(process.env.DATUS_SEO_HOME || join(homedir(), '.datus-seo-weekly'));
export const DATA_DIR = join(SEO_HOME, 'data');
export const REPORTS_DIR = join(SEO_HOME, 'reports');

export function ensureDirs() {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(REPORTS_DIR, { recursive: true });
}

dotenv.config({ path: join(SEO_HOME, '.env') });
