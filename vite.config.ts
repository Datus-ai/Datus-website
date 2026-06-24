import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { existsSync, statSync, readFileSync } from 'node:fs';

// Every MPA entry served from a directory. Used both for the rollup inputs and
// the clean-URL redirect plugin below, so the two never drift apart.
const MPA_ROUTES = [
  'glossary',
  'products/cli',
  'products/vscode',
  'products/studio',
  'products/enterprise',
  'integrations',
  'pricing',
  'faq',
];

// Locally mirror GitHub Pages behavior: redirect a clean URL like `/products/cli`
// to `/products/cli/` so the MPA entry (products/cli/index.html) is served in
// dev/preview instead of falling back to the root SPA.
const cleanUrls = () => {
  const redirect = (server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      const pathname = (req.url || '').split('?')[0] || '';
      // Only redirect the bare clean URL (`/faq`) to its dir form (`/faq/`).
      // A path that already ends in `/` is the canonical form and must be
      // served as-is — redirecting it would loop `/faq/` -> `/faq/` forever.
      if (!pathname.endsWith('/')) {
        const target = pathname.replace(/^\//, '');
        if (MPA_ROUTES.includes(target)) {
          res.statusCode = 301;
          res.setHeader('Location', `/${target}/`);
          res.end();
          return;
        }
      }
      next();
    });
  };
  return {
    name: 'clean-urls',
    configureServer: redirect,
    configurePreviewServer: redirect,
  };
};

// The blog (and its sitemap) is a build-time artifact emitted into dist/ by
// scripts/build-blog.mjs — `vite dev` has no /blog route and would otherwise
// fall back to the root SPA, showing the homepage at /blog/. This serves the
// generated blog from dist/ in dev so the Blog nav link works after a build
// (run `npm run build:all` once). Edits to posts need a rebuild to show up.
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.json': 'application/json', '.txt': 'text/plain',
};
const serveBuiltBlog = () => {
  const DIST = path.resolve(__dirname, 'dist');
  const BLOG_ROOT = path.resolve(DIST, 'blog');
  let warned = false;
  const resolveFile = (urlPath: string): string | null => {
    const p = (urlPath.split('?')[0] || '').replace(/\/$/, '') || '/blog';
    // Resolve and confine to dist/blog so `..` segments can't escape the dir.
    const base = path.resolve(DIST, `.${p}`);
    if (base !== BLOG_ROOT && !base.startsWith(BLOG_ROOT + path.sep)) return null;
    for (const cand of [base, path.join(base, 'index.html')]) {
      if (existsSync(cand) && statSync(cand).isFile()) return cand;
    }
    return null;
  };
  return {
    name: 'serve-built-blog',
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!/^\/blog(\/|$|\?)/.test(url)) return next();
        const file = resolveFile(url);
        if (!file) {
          if (!warned) {
            warned = true;
            // eslint-disable-next-line no-console
            console.warn('[serve-built-blog] no built blog in dist/ — run `npm run build:all` to preview /blog in dev.');
          }
          return next();
        }
        res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
        res.end(readFileSync(file));
      });
    },
  };
};

// Blog post images (and favicon/logo) live in blog/public/ and are referenced
// at the site root (e.g. /images/...). In production scripts/build-blog.mjs
// copies them into dist/, but vite's publicDir is src/public, so `vite dev`
// has no route for them — requests fall through to the SPA fallback and render
// as broken images. Serve any request that maps to a real file under
// blog/public/ straight from source (no rebuild needed when an image changes).
const serveBlogPublic = () => {
  const PUBLIC = path.resolve(__dirname, 'blog/public');
  const handler = (server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      const pathname = (req.url || '').split('?')[0].split('#')[0];
      if (!pathname || pathname.endsWith('/')) return next();
      const file = path.resolve(PUBLIC, decodeURIComponent(pathname).replace(/^\/+/, ''));
      // Confine to blog/public so `..` segments can't escape the dir.
      if (file !== PUBLIC && !file.startsWith(PUBLIC + path.sep)) return next();
      if (!existsSync(file) || !statSync(file).isFile()) return next();
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.end(readFileSync(file));
    });
  };
  return { name: 'serve-blog-public', configureServer: handler, configurePreviewServer: handler };
};

export default defineConfig(() => ({
  plugins: [react(), cleanUrls(), serveBuiltBlog(), serveBlogPublic()],
  base: '/',
  publicDir: 'src/public', 
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          MPA_ROUTES.map((route) => [
            route.replace(/\//g, '-'),
            path.resolve(__dirname, `${route}/index.html`),
          ]),
        ),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
}));
