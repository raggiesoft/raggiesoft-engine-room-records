/**
 * @license MIT
 * ============================================================================
 * astro.config.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * Architectural Overview:
 * Configures Astro 6 for 100% zero-database Static Site Generation (SSG).
 * Outputs clean static HTML bundles to `./dist` for deployment to
 * `/var/www/engineroom.raggiesoft.com` via Jenna & Sarah.
 * ============================================================================
 */

export default {
  site: 'https://engineroom.raggiesoft.com',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  }
};
