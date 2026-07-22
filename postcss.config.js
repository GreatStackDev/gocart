/**
 * tradrsAvenue — PostCSS Configuration
 *
 * Plugin order matters:
 *  1. @stylexjs/postcss-plugin  — scans source files, replaces @stylex
 *     directive with the compiled atomic CSS classes.
 *  2. @tailwindcss/postcss       — processes Tailwind utilities (coexists
 *     with StyleX during the migration period).
 *
 * The StyleX plugin reads babel.config.js automatically to understand
 * the same transform options used at compile time.
 */

const babelConfig = require("./babel.config");

/** @type {import('postcss').ProcessOptions} */
const config = {
  plugins: {
    "@stylexjs/postcss-plugin": {
      /**
       * Glob patterns for files that contain StyleX calls.
       * Keep in sync with your source layout.
       */
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
      ],

      /**
       * Pass the same Babel config so the PostCSS plugin uses an
       * identical transform to the Babel compilation pass.
       */
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: babelConfig.plugins,
      },

      /**
       * Use CSS @layer so StyleX styles are properly ordered relative
       * to Tailwind utilities.
       */
      useCSSLayers: true,
    },

    "@tailwindcss/postcss": {},
  },
};

module.exports = config;
