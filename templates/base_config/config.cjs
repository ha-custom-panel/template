const path = require("path");

module.exports = {
  // Target directory for the build.
  buildDir: path.resolve(__dirname, "build"),
  nodeDir: path.resolve(__dirname, "../node_modules"),

  // Configuration elements that must match the Home Assistant panel registration command.
  //
  // Example:
  //
  // await panel_custom.async_register_panel(
  //   hass=hass,
  //   frontend_url_path=<haURL>,
  //   webcomponent_name=<webComponentName>,
  //   sidebar_title="title",
  //   sidebar_icon="mdi:power",
  //   module_url=f"{<staticPagesPath>}/entrypoint-{build_id}.js",
  //   embed_iframe=True,
  //   require_admin=True,
  // )
  //
  // These variables are used by the build scripts and must align between your
  // source pages and Home Assistant. See the documentation of the template for more
  // information.
  //
  // These values must be changed or there is a risk of conflicting with another integration.

  staticPagesPath: "/panel_static",
  haURL: "panel_name",
  webComponentName: "panel-frontend",
};
