/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const env = require("./env.cjs");
const paths = require("./paths.cjs");

// Question: Do we need `sourceMapURL`?
// GitHub base URL to use for production source maps
// Nightly builds use the commit SHA, otherwise assumes there is a tag that matches the version
module.exports.sourceMapURL = () => {
  const ref = env.version().endsWith("dev")
    ? process.env.GITHUB_SHA || "dev"
    : env.version();
  return `https://raw.githubusercontent.com/home-assistant/frontend/${ref}`;
};
// Files from NPM Packages that should not be imported
module.exports.ignorePackages = ({ latestBuild }) => [
  // Part of yaml.js and only used for !!js functions that we don't use
  require.resolve("esprima"),
];

// Files from NPM packages that we should replace with empty file
module.exports.emptyPackages = ({ latestBuild, isHassioBuild }) =>
  [
    // Contains all color definitions for all material color sets.
    // We don't use it
    require.resolve("@polymer/paper-styles/color.js"),
    require.resolve("@polymer/paper-styles/default-theme.js"),
    // Loads stuff from a CDN
    require.resolve("@polymer/font-roboto/roboto.js"),
    require.resolve("@vaadin/vaadin-material-styles/typography.js"),
    require.resolve("@vaadin/vaadin-material-styles/font-icons.js"),
    // Compatibility not needed for latest builds
    latestBuild &&
      // wrapped in require.resolve so it blows up if file no longer exists
      require.resolve(
        path.resolve(
          paths.polymer_dir,
          "homeassistant-frontend/src/resources/compatibility.ts"
        )
      ),
    // This polyfill is loaded in workers to support ES5, filter it out.
    latestBuild && require.resolve("proxy-polyfill/src/index.js"),
  ].filter(Boolean);

module.exports.definedVars = ({ isProdBuild, latestBuild, defineOverlay }) => ({
  __DEV__: !isProdBuild,
  __BUILD__: JSON.stringify(latestBuild ? "latest" : "es5"),
  __VERSION__: JSON.stringify(env.version()),
  __DEMO__: false,
  __SUPERVISOR__: false,
  __BACKWARDS_COMPAT__: false,
  __STATIC_PATH__: "/static/",
  "process.env.NODE_ENV": JSON.stringify(
    isProdBuild ? "production" : "development"
  ),
  ...defineOverlay,
});

module.exports.htmlMinifierOptions = {
  caseSensitive: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  decodeEntities: true,
  removeComments: true,
  removeRedundantAttributes: true,
  minifyCSS: {
    compatibility: "*,-properties.zeroUnits",
  },
};

module.exports.terserOptions = ({ latestBuild, isTestBuild }) => ({
  safari10: !latestBuild,
  ecma: latestBuild ? 2015 : 5,
  format: { comments: false },
  sourceMap: !isTestBuild,
});

module.exports.babelOptions = ({ latestBuild, isProdBuild, isTestBuild }) => ({
  babelrc: false,
  compact: false,
  assumptions: {
    privateFieldsAsProperties: true,
    setPublicClassFields: true,
    setSpreadProperties: true,
  },
  browserslistEnv: latestBuild ? "modern" : "legacy",
  // Must be unambiguous because some dependencies are CommonJS only
  sourceType: "unambiguous",
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: latestBuild ? false : "entry",
        corejs: latestBuild ? false : { version: "3.30", proposals: true },
        bugfixes: true,
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      path.resolve(
        paths.polymer_dir,
        "build-scripts/babel-plugins/inline-constants-plugin.cjs"
      ),
      {
        modules: ["@mdi/js"],
        ignoreModuleNotFound: true,
      },
    ],
    // Minify template literals for production
    isProdBuild && [
      "template-html-minifier",
      {
        modules: {
          lit: [
            "html",
            { name: "svg", encapsulation: "svg" },
            { name: "css", encapsulation: "style" },
          ],
          "@polymer/polymer/lib/utils/html-tag": ["html"],
        },
        strictCSS: true,
        htmlMinifier: module.exports.htmlMinifierOptions,
        failOnError: true, // we can turn this off in case of false positives
      },
    ],
    // Import helpers and regenerator from runtime package
    [
      "@babel/plugin-transform-runtime",
      { version: require("../package.json").dependencies["@babel/runtime"] },
    ],
    // Support  some proposals still in TC39 process
    ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
  ].filter(Boolean),
  exclude: [
    // \\ for Windows, / for Mac OS and Linux
    /node_modules[\\/]core-js/,
    /node_modules[\\/]webpack[\\/]buildin/,
  ],
  sourceMaps: !isTestBuild,
});

const nameSuffix = (latestBuild) => (latestBuild ? "-latest" : "-es5");

const outputPath = (outputRoot, latestBuild) =>
  path.resolve(outputRoot, latestBuild ? "frontend_latest" : "frontend_es5");

const publicPath = (latestBuild, root = "") =>
  latestBuild ? `${root}/frontend_latest/` : `${root}/frontend_es5/`;

module.exports.config = {
  panel({ isProdBuild, latestBuild }) {
    return {
      name: "panel" + nameSuffix(latestBuild),
      entry: {
        entrypoint: path.resolve(paths.panel_dir, "src/entrypoint.ts"),
      },
      outputPath: outputPath(paths.panel_output_root, latestBuild),
      publicPath: publicPath(latestBuild, paths.panel_publicPath),
      isProdBuild,
      latestBuild,
    };
  },
};
