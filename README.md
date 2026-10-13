# ClauseGuard Frontend

ClauseGuard is a Next.js frontend for reviewing contracts against the ClauseGuard API. It supports contract uploads, text extraction, analysis progress, prioritized findings, and saved analysis results.

## Features

- Responsive landing page with accessible navigation and scroll-reveal effects.
- Contract analysis from pasted text or uploaded `.pdf`, `.docx`, and `.txt` files.
- Processing state with progress feedback while the backend evaluates a contract.
- Results view with prioritized detections, risk levels, explanations, and a safe empty state.
- Saved analysis history and latest evaluation metrics.
- Responsive layouts, keyboard focus states, skip navigation, and reduced-motion support.

## Requirements

- Node.js 20 or newer
- npm
- A running ClauseGuard backend

## Setup

From this directory, install the dependencies:

```powershell
npm install
```

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_BASE_URL=https://clauseguard-q5fk.onrender.com
```

For local backend development, use:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_BASE_URL` is exposed to the browser, so it should contain only the public backend URL. Never place API keys or other secrets in frontend environment variables.

## Development

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```powershell
npm run lint
npm run build
npm run start
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | ClauseGuard landing page |
| `/analyzer` | Paste or upload a contract and start an analysis |
| `/runs/[runId]` | View the completed analysis report and detections |
| `/saved-contracts` | View previously saved analysis runs |
| `/evaluation` | View the latest persisted evaluation metrics |

## Backend integration

The frontend uses the configured API base URL to call:

- `GET /health` — confirm that the backend is available.
- `POST /api/analyze` — submit contract text for analysis.
- `GET /api/runs` — load saved analysis runs.
- `GET /api/runs/{run_id}` — load one saved analysis result.
- `GET /api/eval/latest` — load the latest evaluation metrics.

The backend must be reachable from the browser and configured to allow requests from the frontend origin through CORS.

## File uploads

The analyzer extracts text in the browser before submitting it to the API:

- PDF files use the bundled PDF.js worker at `public/pdf.worker.mjs`.
- DOCX files use `mammoth`.
- Plain text files are read directly.

The API receives extracted `contract_text`; the original file is not uploaded as a file.

## Accessibility and motion

The interface includes semantic controls, visible keyboard focus, accessible labels, a skip link, responsive layouts, and reduced-motion handling. Keep these behaviors intact when changing the UI.

## Deploy to Vercel

1. Import the frontend repository or frontend directory into Vercel.
2. Use the frontend directory as the project root.
3. Add this environment variable in the Vercel project settings:

   ```text
   NEXT_PUBLIC_API_BASE_URL=https://clauseguard-q5fk.onrender.com
   ```

4. Deploy the project.
5. Redeploy after changing environment variables.

For production deployments, verify that the deployed frontend can reach the backend with:

```powershell
curl.exe --noproxy "*" https://clauseguard-q5fk.onrender.com/health
```

## Project structure

```text
src/
  app/          Next.js routes and layouts
  components/   Shared UI and analysis components
  lib/          API and client-side helpers
public/
  icon.png      Browser favicon and product icon
  pdf.worker.mjs
```

## Legal notice

ClauseGuard provides informational contract analysis and does not provide legal advice. Consult a qualified legal professional before making legal or commercial decisions.