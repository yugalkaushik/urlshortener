# LinkForge

A simple URL shortener built with Express, TypeScript, and MongoDB. It creates short links, tracks clicks, and shows basic analytics in a clean web UI.

## What it does

- Create short links from long URLs
- Redirect visitors to the original URL
- Count clicks for each short link
- Show analytics like total clicks, daily clicks, and referrers
- Serve a small web interface from the same app

## How it works

1. You enter a long URL in the web page.
2. The app saves it in MongoDB and generates a short code.
3. The short URL points to `/:code`.
4. When someone opens the short URL, the app:
   - finds the original URL
   - increases the click count
   - stores a click record
   - redirects the user to the original page
5. The stats panel reads analytics from `/api/analytics/:code`.

## Project structure

- `src/server.ts` starts the server
- `src/app.ts` sets up Express, middleware, and routes
- `src/routes/` contains API and web routes
- `src/controllers/` handles request/response logic
- `src/services/` contains URL and analytics logic
- `src/models/` contains MongoDB models
- `public/` contains the website UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
PORT=5000
BASE_URL=http://localhost:5000
MONGO_URI=mongodb://127.0.0.1:27017/url_shortener
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
```

3. Start MongoDB locally.

4. Run the app:

```bash
npm run dev
```

5. Open:

```text
http://localhost:5000
```

## API

- `POST /api/shorten` — create a short link
- `GET /:code` — open a short link and redirect to the original URL
- `GET /api/analytics/:code` — view analytics for a link
- `DELETE /api/urls/:code` — deactivate a link
- `GET /health` — health check

## Example request

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","ttlSeconds":3600}'
```

