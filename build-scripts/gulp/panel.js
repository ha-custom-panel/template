/* eslint @typescript-eslint/no-var-requires: "off", import/extensions: "off" */
import gulp from "gulp";
import env from "../env.cjs";
import "./clean.js";
import "./compress.js";
import "./entry-html.js";
import "./gen-icons-json.js";
import "./rollup.js";
import "./wds.js";
import "./webpack.js";

gulp.task(
  "develop-panel",
  gulp.series(
    async function setEnv() {
      process.env.NODE_ENV = "development";
    },
    "clean-panel",
    "gen-pages-panel-dev",
    "webpack-watch-panel"
  )
);

gulp.task(
  "build-panel",
  gulp.series(
    async function setEnv() {
      process.env.NODE_ENV = "production";
    },
    "clean-panel",
    // "ensure-panel-build-dir",
    "webpack-prod-panel",
    "gen-pages-panel-prod",
    ...// Don't compress running tests
    (env.isTestBuild() ? [] : ["compress-panel"])
  )
);
