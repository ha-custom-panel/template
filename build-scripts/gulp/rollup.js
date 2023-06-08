// Tasks to run Rollup

import log from "fancy-log";
import gulp from "gulp";
import http from "http";
import open from "open";
import path from "path";
import { rollup } from "rollup";
import handler from "serve-handler";
import paths from "../paths.cjs";
import rollupConfig from "../rollup.cjs";

const bothBuilds = (createConfigFunc, params) =>
  gulp.series(
    async function buildLatest() {
      await buildRollup(
        createConfigFunc({
          ...params,
          latestBuild: true,
        })
      );
    },
    async function buildES5() {
      await buildRollup(
        createConfigFunc({
          ...params,
          latestBuild: false,
        })
      );
    }
  );

function createServer(serveOptions) {
  const server = http.createServer((request, response) =>
    handler(request, response, {
      public: serveOptions.root,
    })
  );

  server.listen(
    serveOptions.port,
    serveOptions.networkAccess ? "0.0.0.0" : undefined,
    () => {
      log.info(`Available at http://localhost:${serveOptions.port}`);
      open(`http://localhost:${serveOptions.port}`);
    }
  );
}

function watchRollup(createConfig, extraWatchSrc = [], serveOptions = null) {
  const { inputOptions, outputOptions } = createConfig({
    isProdBuild: false,
    latestBuild: true,
  });

  const watcher = rollup.watch({
    ...inputOptions,
    output: [outputOptions],
    watch: {
      include: ["src/**"] + extraWatchSrc,
    },
  });

  let startedHttp = false;

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_END") {
      log(`Build done @ ${new Date().toLocaleTimeString()}`);
    } else if (event.code === "ERROR") {
      log.error(event.error);
    } else if (event.code === "END") {
      if (startedHttp || !serveOptions) {
        return;
      }
      startedHttp = true;
      createServer(serveOptions);
    }
  });

  gulp.watch(
    path.join(paths.translations_src, "en.json"),
    gulp.series("build-translations", "copy-translations-app")
  );
}

async function buildRollup(config) {
  const bundle = await rollup.rollup(config.inputOptions);
  await bundle.write(config.outputOptions);
}

gulp.task("rollup-watch-panel", () => {
  watchRollup(rollupConfig.createPanelConfig);
});

gulp.task(
  "rollup-prod-panel",
  bothBuilds(rollupConfig.createPanelConfig, { isProdBuild: true })
);
