---
title: Custome Panel Template
description: Instructions on how to use this template to build a custom panel for Home Assistant.
---

## Introduction

This repository is provided as a template for Home Assistant integrations to provide thier own custom panel. 
A custom panel can be used to provide integration specific functions not native to Home Assistant. Examples of integrations
that current provide custom panels are:
 - Dynalite
 - Insteon
 - KNX

 This template is also intended to make it easier for integrations to upgrade thier custom panel to utilize the latest Home Assistant frontend
 version.

## Getting Started

To get started create a new repository from this template.  The the [instructions] on GitHub for how to create a new repository based
on a template.

[instructions]: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template

## Upgrading the Home Assistant Frontend Version

The maintainers of this template will, on occasion, upgrade the Home Assistant frontend version. To upgrade to the latest version of the frontend
follow these steps:

1. Set this repository as a remote repository:
  - ` git remote add template https://ha-custom-panel/template`
2. Fetch the latest version of this template:
  - `git fetch template`
3. Merge the current version of the template to your repository
  - `get merge template/main --allow-unrelated-histories`


<p class="warning">Performing a merge with unrelated historys performs a file by file diff to determine the merge. It is strongly recommended not to change files 
provided as part of the template unless otherwise noted. To identify which files provided by the template are expected to be edited, see <some section> below.</p>