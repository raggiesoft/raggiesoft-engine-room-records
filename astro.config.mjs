/**
 * @license MIT
 * ============================================================================
 * astro.config.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL JAVASCRIPT GUIDE):
 * What is this file?
 *   This is the project configuration file for Astro 6. When a developer or
 *   build tool inspects this repository, `astro.config.mjs` defines the canonical
 *   domain name, output folder, and clean-URL folder structure for the site.
 *
 * Why does the filename end in `.mjs`?
 *   In Node.js, `.mjs` stands for "ECMAScript Module" (modern JavaScript modules).
 *   It allows us to use standard `import` and `export default` syntax instead of
 *   older Node.js `require()` / `module.exports` syntax.
 *
 * How does it fit into the build lifecycle?
 *   - Input: Static configuration settings (no database connections or secrets).
 *   - Build Pipeline: Paired with `scripts/build.mjs`, which reads flat-file JSON
 *     manifests from `raggiesoft-assets/engine-room-records/` and compiles every
 *     page into static HTML files inside `./dist`.
 *   - Output: Clean, zero-database static HTML directories deployed to
 *     `/var/www/engineroom.raggiesoft.com` via `jenna-sync.sh` and `sarah-deploy.sh`.
 * ============================================================================
 */

// `export default` exposes this configuration object as the main output of the module
// so Astro's CLI and tooling can read our site settings automatically.
export default {
  // The full production base URL used when generating canonical URLs and sitemaps.
  site: 'https://engineroom.raggiesoft.com',

  // `'static'` tells Astro to pre-build 100% of pages into plain `.html` files at
  // build time (Static Site Generation / SSG) rather than running a live server on every visit.
  output: 'static',

  // The folder where finished, ready-to-upload website files are written.
  outDir: './dist',

  // `'never'` keeps URLs clean without a trailing slash (e.g., `/corporate` instead of `/corporate/`).
  trailingSlash: 'never',

  // Nested build output options controlling how HTML files are arranged on disk.
  build: {
    // `'directory'` writes each route as its own folder containing an `index.html` file
    // (for example, `/corporate` -> `./dist/corporate/index.html`), allowing Nginx to
    // serve clean extensionless URLs without `.html` at the end.
    format: 'directory'
  }
};
