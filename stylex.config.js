/**
 * tradrsAvenue — StyleX Compiler Configuration
 *
 * Controls how the StyleX babel/SWC plugin resolves imports, outputs
 * the generated CSS, and handles aliases that match our jsconfig paths.
 *
 * This file is consumed by:
 *   - @stylexjs/nextjs-plugin  (via next.config.mjs)
 *   - @stylexjs/babel-plugin   (for Jest / standalone transforms)
 */

/** @type {import('@stylexjs/nextjs-plugin').StyleXConfig} */
const styleXConfig = {
  /**
   * Where to emit the single compiled CSS bundle.
   * Next.js will serve this automatically via the plugin.
   */
  outputCSS: true,

  /**
   * Root directory — used to resolve absolute import paths.
   */
  rootDir: __dirname,

  /**
   * Import aliases that map to actual paths so StyleX can
   * statically analyse cross-file token imports.
   * Keep in sync with jsconfig.json `paths`.
   */
  aliases: {
    "@/*": ["./*"],
  },

  /**
   * Use the SWC/Turbopack-compatible transform when available
   * (Next.js 15+ with --turbopack flag).
   */
  useCSSLayers: true,

  /**
   * Inject styles into the document <head> in dev mode for
   * faster HMR; in production the CSS is extracted to a file.
   */
  dev: process.env.NODE_ENV === "development",

  /**
   * Enable StyleX's runtime checks in development only.
   */
  runtimeInjection: process.env.NODE_ENV === "development",
};

module.exports = styleXConfig;
