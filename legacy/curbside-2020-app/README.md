# Curbside (Legacy App)

This folder contains the archived curbside operations codebase used during the 2020 COVID response period.

## Status

This system has not been active since 2020.

## Running Locally (Legacy)

From the repository root:

```bash
cd legacy/curbside-2020-app
npm install
npm start
```

If needed, functions emulation can be started from this folder:

```bash
firebase emulators:start --only functions --project your-project-id
```

Environment files (`.env`, `functions/.env`) are optional and only needed if you want to connect this archival codebase to live services.
