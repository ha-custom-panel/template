import fs from "fs"

let rawcore = fs.readFileSync("./homeassistant-frontend/package.json");
let rawapp = fs.readFileSync("./package.json.project");

const core = JSON.parse(rawcore);
const app = JSON.parse(rawapp);

for (let k in core.resolutions) {
  core.resolutions[k] = core.resolutions[k].replace(
    "./.yarn/",
    "./homeassistant-frontend/.yarn/"
  );
}

fs.writeFileSync(
  "./package.json",
  JSON.stringify(
    {
      ...app,
      resolutions: { ...app.resolutions, ...core.resolutions },
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

const yarnRcCore = fs.readFileSync("./homeassistant-frontend/.yarnrc.yml", "utf8");
const yarnRcKnx = yarnRcCore.replace(/\.yarn\//g, "homeassistant-frontend/.yarn/");
fs.writeFileSync("./.yarnrc.yml", yarnRcKnx);
