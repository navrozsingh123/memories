# Memories

A MERN app for sharing memories — post a photo with a title, message and tags,
and like other people's posts. Express + MongoDB on the back end, React + Vite +
Redux + MUI on the front end, with JWT auth (email/password and Google sign-in).

## Setup

Install dependencies in both halves:

```bash
npm install --prefix server && npm install --prefix client
```

### `server/.env`

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `PORT` | API port (defaults to `5001`) |
| `JWT_SECRET` | Secret used to sign session tokens — keep it private |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID, used to verify Google sign-ins |

### `client/.env`

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Same Google client ID as the server |
| `VITE_API_URL` | API base URL (defaults to `http://localhost:5001`) |

`GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` must be the same value, or Google
sign-in will be rejected when the server verifies the token.

## Running

Two terminals:

```bash
npm start --prefix server
```

```bash
npm run dev --prefix client
```

The API listens on `http://localhost:5001`, the app on `http://localhost:5173`.

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/users/signup` | — | Create an account, returns `{ result, token }` |
| `POST` | `/users/signin` | — | Sign in, returns `{ result, token }` |
| `POST` | `/users/google` | — | Exchange a Google credential for an app token |
| `GET` | `/posts?page=N` | — | List posts, newest first, 8 per page |
| `POST` | `/posts` | ✓ | Create a post (author taken from the token) |
| `PATCH` | `/posts/:id` | ✓ | Update a post — author only |
| `DELETE` | `/posts/:id` | ✓ | Delete a post — author only |
| `PATCH` | `/posts/:id/likePost` | ✓ | Toggle your like on a post |

`GET /posts` returns `{ data, currentPage, numberOfPages, total }`. An out-of-range
`page` is clamped to the last page and a non-numeric one falls back to page 1.

## Sample data

To fill the feed with sample memories from several authors:

```bash
node server/seed.js
```

This creates five demo author accounts (`mia@memories.demo`, `diego@…`,
`amara@…`, `tom@…`, `sofia@…`) alongside posts attributed to your own account,
so the feed reads like a real multi-user one. Every sample post is tagged
`sample` and carries a matching photo from Unsplash's CDN.

The script is re-runnable — existing sample posts are refreshed rather than
duplicated.

> The demo accounts share the password `demo1234`. They are ordinary,
> sign-in-able accounts, so remove them before pointing this at anything real:

```bash
node server/seed.js --undo
```

That deletes the demo authors and every post tagged `sample`, leaving your own
account and any posts you wrote untouched.

Authenticated requests send `Authorization: Bearer <token>`. Tokens expire after
an hour; the client signs the user out as soon as one lapses.

## Deploying to Vercel

The client and the API deploy as **two separate Vercel projects from this one
repo**, each with a different Root Directory.

### 1. API project

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Framework Preset | Other |

Environment variables (Settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a fresh random string — not the one used locally |
| `GOOGLE_CLIENT_ID` | your Google OAuth client ID |
| `CLIENT_ORIGIN` | the client's URL, e.g. `https://memories-client.vercel.app` |

`server/vercel.json` routes every path to `api/index.js`, which exports the
Express app. `server/index.js` is only used locally.

Deploy this first — you need its URL for the client.

### 2. Client project

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Framework Preset | Vite (auto-detected) |

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | the API project's URL, no trailing slash |
| `VITE_GOOGLE_CLIENT_ID` | the same Google client ID |

`client/vercel.json` rewrites all paths to `index.html`, without which
reloading a deep link such as `/posts?page=2` returns a 404.

Vite inlines `VITE_*` variables at build time, so after changing either one you
must redeploy — restarting is not enough.

### 3. Two things outside Vercel

**MongoDB Atlas** — serverless functions have no fixed IP. Under Network
Access, allow `0.0.0.0/0`, or the API will hang and then return 503.

**Google Cloud Console** — add the client's deployed URL to your OAuth client's
*Authorised JavaScript origins*, or Google sign-in fails with `origin_mismatch`.

### Before going live

Remove the demo accounts, which share a published password:

```bash
node server/seed.js --undo
```

Run it against the production database (with `MONGO_URI` pointed at it), not
just locally.
