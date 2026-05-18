# NYC Renting Assistant

A Chrome extension that surfaces building health data for NYC rental listings directly on the listing page, no extra tabs needed.

Supports **Zillow**, **StreetEasy**, and **Apartments.com**.

## Features

- **Building grade (A–F)** — composite score from violations, complaints, and pest history
- **HPD complaints & violations** — housing maintenance code issues and open service requests
- **DOB complaints & violations** — structural and construction issues
- **ECB violations** — environmental control board penalty fines (most serious category)
- **Pest history** — bedbug reports by year, rodent inspection failure rate
- **Neighborhood safety** — NYPD crime data (felonies, misdemeanors, violations within 400m)
- **Nearby amenities** — grocery stores, parks, laundry, subway stations within 800m
- **Bookmarks** — save listings with notes and listed price; sort, filter, and compare side-by-side
- **Auth** — email/password and Google OAuth via Supabase
- **Toggleable sections** — show/hide any data category from the settings panel

## Architecture

| Layer | Role |
|-------|------|
| Content script | Scrapes address and price from the listing page DOM; renders the sidebar |
| Background service worker | API client, rate limiter, cache, auth, bookmark sync |
| Popup | Quick status and auth entry point |
| Bookmarks tab | Standalone page for managing and comparing saved listings |

Data is fetched from public APIs in the background worker and cached in Chrome local storage to avoid rate limits.

## APIs

| API | Purpose |
|-----|---------|
| [NYC Geoclient v2](https://api.nyc.gov) | Resolve street address → BBL/BIN + coordinates |
| [Augrented](https://augrented.com) | HPD/DOB complaints, violations, bedbug reports, rodent inspections |
| [NYC Open Data (NYPD)](https://data.cityofnewyork.us) | Crime complaints within 400m radius |
| [Google Places API](https://places.googleapis.com) | Nearby amenities (grocery, parks, laundry, subway) |

## Tech Stack

- React + TypeScript 
- Tailwind CSS
- Supabase (auth + bookmarks database)
- Chrome Extension Manifest V3

## Setup

### Prerequisites

- Node.js 18+
- Google Chrome
- [NYC Geoclient API key](https://api.nyc.gov)
- [Google Places API key](https://console.cloud.google.com) (Places API enabled)
- [Supabase](https://supabase.com) project

### Install

```bash
cd frontend
npm install
```

### Environment variables

```bash
cp frontend/.env.example frontend/.env
```

Fill in `frontend/.env`:

```env
VITE_NYC_OPENDATA_API_KEY=your_nyc_geoclient_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_API_KEY=your_google_places_api_key
```

### Build

```bash
cd frontend
npm run build
```

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `frontend/dist`

## Development

```bash
cd frontend
npm run dev
```

Run tests:

```bash
cd frontend
npm test
```

## Project Structure

```
frontend/src/
├── background/       # Service worker: API client, auth, bookmarks, cache, rate limiter
├── content/          # Content script: mounts sidebar, detects address/price per site
│   └── selectors/    # Site-specific DOM scrapers (zillow, streeteasy, apartments.com)
├── components/
│   ├── features/     # Complaint, violation, pest, safety, amenities, bookmark UI
│   └── ui/           # Shared primitives (Card, Badge, Button, Toggle, etc.)
├── hooks/            # useAuth, useBookmarks, useExtensionData
├── pages/            # Bookmarks tab (standalone Chrome page)
├── popup/            # Extension popup
├── types/            # Shared TypeScript types (BuildingData, Bookmark, etc.)
└── utils/            # buildingGrade, neighborhoodSafety, haversine, priceParser, etc.
```

## Team

- Andrew Li
- Nuzhat Khan
- Axel Mejia Lopez