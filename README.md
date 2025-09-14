# Interactive Travel POI Map

An interactive world map that shows common travel destinations (POIs) with a minimal dark theme. It includes clustering, popups with save/unsave and navigation, a draggable multi-tab bottom sheet, and a mini map of the current viewport.

Related UI reference: `https://map.tao-bin.com`  •  Performance guideline: `https://infinitejs.com/posts/leafletjs-common-map-rendering-issues/`

## Overview

- Minimal dark Leaflet map with clustered POIs
- Popups: brief info, open in Maps, heart to save/unsave
- Bottom sheet tabs: Current (viewport), All (by country), Saved; draggable to 10%/50%/100%
- Mini map: shows current viewport rectangle; placeholders for continent and country/state markers
- Mobile-friendly touch interactions; saved list persisted locally

## Tech Stack

- React + TypeScript + Vite (app in `poi-map/`)
- Leaflet + React-Leaflet, supercluster
- Zustand for state

## Development

Prerequisites:

- Node.js 18+ (recommend 20)
- npm 10+

Run locally:

```bash
cd poi-map
npm install
npm run dev
```

Open the local dev URL printed by Vite.

## Deployment

### GitHub Pages (production)

This repository deploys to GitHub Pages from `main` using GitHub Actions.

- Workflow file: `.github/workflows/deploy.yml`
- Vite base path is set via `VITE_BASE` in CI to serve under `/<repo>/`.
- In repo Settings → Pages, set Source to “GitHub Actions”.

### PR Preview Deployments

For each pull request to `main`, the workflow builds and publishes a GitHub Pages preview deployment. A comment with the preview URL is posted on the PR.

Notes:

- Previews are isolated per PR and update on new commits.
- Previews are automatically retired when the PR is closed/merged.

## Environment Variables

- `VITE_BASE` (optional locally): Base path for Vite build. CI sets this automatically for Pages.

## Repository Layout

- `poi-map/`: Application source (Vite + React TS)

## License

MIT
 