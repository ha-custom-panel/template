/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const config = require("../config.cjs");

module.exports = {
  polymer_dir: path.resolve(__dirname, ".."),

  src_dir: path.resolve(__dirname, "../src"),

  build_dir: path.resolve(__dirname, "../panel_frontend"),

  panel_dir: path.resolve(__dirname, ".."),
  panel_output_root: path.resolve(__dirname, "../panel_frontend"),
  panel_output_static: path.resolve(__dirname, "../panel_frontend/static"),
  panel_output_latest: path.resolve(
    __dirname,
    "../panel_frontend/frontend_latest"
  ),
  panel_output_es5: path.resolve(__dirname, "../panel_frontend/frontend_es5"),
  panel_publicPath: config.staticPagesPath,

  translations_src: path.resolve(__dirname, "../src/translations"),
};
