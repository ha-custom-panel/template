## Introduction

This repository is provided as a template for Home Assistant integrations to provide thier own custom panel.
A custom panel can be used to provide integration specific functions not native to Home Assistant. Examples of integrations
that current provide custom panels are:

- [Dynalite](https://github.com/ziv1234/dynalitepanel)
- [Insteon](https://github.com/pyinsteon/insteon-panel)
- [KNX](https://github.com/XKNX/knx-frontend)

This template is also intended to make it easier for integrations to upgrade thier custom panel to utilize the latest Home Assistant frontend
version.

# Getting Started

To get started create a new repository from this template. The the [instructions] on GitHub for how to create a new repository based
on a template.

### Devcontainer set up

If you are using a devcontainer, the `script/bootstrap` script will be executed whenever the devcontainer is built. This will ensure
all your base files are in place and your project has the required base files. Subsiquent rebuilds will not change your project
specific files.

### Manual set up

If you are not utilizing a devcontainer, manually run the `script/bootstrap` script.

### package.json.project

The `package.json` file is generaged by merging the `./package.json.project` file and the `./homeassistant-frontend/package.json`
file. A template `package.json.project`file is available in the`templates`folder. All project specific packages should be added to the`package.json.project`file including any project specific metadata such as`name`and`description`.

Whenever you make changes to the `package.json.project` file run the following command to merge the changes into `package.json`:

> node ./script/merge_dependencies.mjs

[instructions]: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template

# Upgrading the Home Assistant Frontend Version

The maintainers of this template will, on occasion, upgrade the Home Assistant frontend version. To upgrade to the latest version of the frontend
follow these steps:

1. Set this repository as a remote repository
2. Fetch the latest version of this template
3. Merge the current version of the template to your repository

**Commands**:

```
git remote add template https://github.com/ha-custom-panel/template
git fetch template`
get merge template/main --allow-unrelated-histories
```

If you are using a dev container, rebuild the dev container which will run `script/bootstrap` to
setup the proper node modules.

Performing a merge with unrelated historys performs a file by file diff to determine the merge. It is strongly recommended not to change files
provided as part of the template unless otherwise noted. To identify which files provided by the template are expected to be edited, see <some section> below.
