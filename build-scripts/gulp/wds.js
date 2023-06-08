import gulp from "gulp";
import { startDevServer } from "@web/dev-server";

gulp.task("wds-watch-panel", async () => {
  startDevServer({
    config: {
      watch: true,
    },
  });
});
