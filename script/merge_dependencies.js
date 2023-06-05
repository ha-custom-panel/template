import fs from "fs";

let rawcore = fs.readFileSync("./homeassistant-frontend/package.json");
let rawapp = fs.readFileSync("./package.json.project");

const core = JSON.parse(rawcore);
const app = JSON.parse(rawapp);

const yarnDirRegExp = /\.yarn\//g;
const yarnDirSubModule = "homeassistant-frontend/.yarn/";

const subdirResolutions = Object.fromEntries(
  Object.entries(core.resolutions).map(([key, value]) => [
    key,
    value.replace(yarnDirRegExp, yarnDirSubModule),
  ])
);

fs.writeFileSync(
  "./package.json",
  JSON.stringify(
    {
      ...app,
      resolutions: { ...app.resolutions, ...subdirResolutions },
      dependencies: { ...app.dependencies, ...core.dependencies },
      devDependencies: {
        ...app.devDependencies,
        ...core.devDependencies,
      },
      prettier: { ...app.prettier, ...core.prettier },
      packageManager: core.packageManager,
    },
    null,
    2
  )
);

const yarnRcCore = fs.readFileSync(
  "./homeassistant-frontend/.yarnrc.yml",
  "utf8"
);
const yarnRcApp = yarnRcCore.replace(yarnDirRegExp, yarnDirSubModule);
fs.writeFileSync("./.yarnrc.yml", yarnRcApp);
