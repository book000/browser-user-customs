# CLAUDE.md

## Overview

A collection of userstyles (`*.user.css` for Stylus) and userscripts
(`*.user.js` for Tampermonkey) that customize specific web pages. Files are
organized by target domain and published as an index page on
[GitHub Pages](https://book000.github.io/browser-user-customs/) via the
`generate-pages` script.

## Repository layout

- `css/<domain>/*.user.css` — userstyles, one directory per target domain
  (e.g. `css/amazon.co.jp/`).
- `js/<domain>/*.user.js` — userscripts, one directory per target domain.
- `packages/` — Node scripts (no build output committed):
  - `css-meta.js` / `js-meta.js` — metadata validators run by `npm run lint`.
  - `generate-pages.js` — renders `packages/template.html` into
    `dist/index.html` for GitHub Pages.
- `css/README.md` / `js/README.md` — the canonical metadata header templates.
  Copy these when creating a new custom file.

## Development commands

- `npm run lint` — validate every custom file's metadata (runs `lint-css` and
  `lint-js` in parallel). Also runs in CI on every push / PR.
- `npm run lint-css` — `node packages/css-meta.js`.
- `npm run lint-js` — `node packages/js-meta.js`.
- `npm run generate-pages` — regenerate `dist/index.html`. Run in CI on push to
  `master`; no need to commit the output.

## Metadata rules (enforced by lint — CI fails otherwise)

Every `*.user.css` / `*.user.js` metadata header must satisfy:

- Required keys are present (see the validators for the exact list; CSS and JS
  differ — JS additionally requires `downloadURL`, `match`, `grant`, `icon`).
- `namespace` is exactly `tomacheese.com`.
- `homepageURL` is `https://github.com/book000/browser-user-customs`.
- `supportURL` is `https://github.com/book000/browser-user-customs/issues`.
- `author` is `Tomachi <tomachi@tomacheese.com> (https://github.com/book000)`.
- `updateURL` (and, for JS, `downloadURL`) is
  `https://raw.githubusercontent.com/book000/browser-user-customs/master/<css|js>/<path-from-that-dir>`.
  The path must match the file's actual location.
- **Version bump**: when editing an existing custom file, `version` must change
  versus the PR base. The version check compares against `BASE_SHA` and fails if
  a modified file keeps the same version.

## Adding a new custom

1. Create the file under the matching `css/<domain>/` or `js/<domain>/`
   directory. Create the domain directory if it does not exist yet.
2. Copy the header template from `css/README.md` or `js/README.md` and fill in
   the fields, keeping the fixed values above.
3. Set `updateURL` (and `downloadURL` for JS) to the path matching the new file.
4. Run `npm run lint` locally before committing.

## Conventions

- Commit messages follow Conventional Commits with Japanese descriptions
  (matching the existing history), e.g.
  `feat(add-folder-copy-button.user.js): 最新の SharePoint の画面仕様に対応`.
- Dependencies are pinned; Renovate manages updates — do not float versions.
