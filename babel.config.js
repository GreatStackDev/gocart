/**
 * tradrsAvenue — Babel Configuration
 *
 * Wires the StyleX Babel plugin into Next.js's compilation pipeline.
 * The @stylexjs/postcss-plugin will read this config to transform
 * StyleX calls and emit the generated CSS via the @stylex directive
 * in globals.css.
 *
 * This config works with both Webpack and Turbopack (Next.js 16+).
 */
module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        /**
         * Enable dev-mode checks (readable class names, runtime
         * validation) in development. Strips them in production.
         */
        dev: process.env.NODE_ENV === "development",

        /**
         * Module resolution strategy — must match the project's
         * module system. We use CommonJS-compatible ESM (Next.js default).
         */
        unstable_moduleResolution: {
          type: "commonJS",
        },

        /**
         * Import paths that StyleX should treat as token definitions.
         * Any file that exports `stylex.defineVars(...)` should be listed here
         * so the compiler can inline them at build time.
         */
        importSources: ["@stylexjs/stylex"],
      },
    ],
  ],
};
