# Sqotify API

REST API for artists, songs, and albums, powered by Express and MongoDB. Includes a vanilla JS frontend for testing.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

```bash
npm install
cp env.example .env
```

Configure `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/
```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm start`    | Run the server                       |
| `npm run dev`  | Run with nodemon (auto-restart)       |
| `npm run seed` | Seed database from `data/*.json`     |
| `npm run teardown` | Clear all artists and songs      |
| `npm run dev:clean` | Teardown, seed, then start     |

## Frontend

A simple vanilla JS app is served at `http://localhost:3000` when the server runs. Use it to browse and manage artists, songs, and albums before building a real frontend.

```
npm start
# Open http://localhost:3000
```

## API

Base URL: `http://localhost:3000`

### Health

```
GET /api/health
→ { message: "Healthy?" }
```

### Artists

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | /api/artists       | List all artists     |
| GET    | /api/artists/:id   | Get artist by id     |
| POST   | /api/artists       | Create artist        |
| PUT    | /api/artists/:id   | Update artist        |
| DELETE | /api/artists/:id   | Delete artist        |

**Create/Update body:** `{ name: string }`

### Songs

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | /api/songs       | List songs (supports query params) |
| GET    | /api/songs/:id   | Get song by id           |
| POST   | /api/songs       | Create song              |
| PUT    | /api/songs/:id   | Update song              |
| DELETE | /api/songs/:id   | Delete song              |

**Create/Update body:** `{ title: string, artist: string }`

**GET /api/songs query params:**

| Param   | Type   | Description                            |
| ------- | ------ | -------------------------------------- |
| `q`     | string | Search in title or artist name         |
| `artist`| string | Filter by exact artist name            |
| `sort`  | string | Sort by `title` or `artist`            |
| `limit` | number | Max number of results (positive int)   |

### Albums

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | /api/albums        | List all albums (supports `?q=`) |
| GET    | /api/albums/:id   | Get album by id      |
| POST   | /api/albums       | Create album         |
| PUT    | /api/albums/:id   | Update album         |
| DELETE | /api/albums/:id   | Delete album         |

**Create/Update body:** `{ title: string, artist: string (ObjectId), releaseDate: string (YYYY-MM-DD) }`

## Project structure

```
├── config/db.js       # MongoDB connection
├── db/                # Data access (Artist, Song, Album)
├── frontend/          # Vanilla JS app (index.html, style.css, app.js)
├── models/            # Mongoose schemas
├── routes/            # Express route handlers
├── scripts/
│   ├── seed.js        # Seed from data/*.json
│   └── teardown.js    # Clear database
├── data/
│   ├── artists.json
│   └── songs.json
└── index.js
```

## Data model

- **Artist**: `{ _id, name, createdAt, updatedAt }`
- **Song**: `{ _id, title, artist (name), createdAt, updatedAt }`

Songs reference artists by name (string), not by id yet.
