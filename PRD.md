# PRD: PhotoSpotter — Phase 1

## Problem Statement

Hobbyist photographers want to discover interesting nearby photo spots when planning a shoot at a given location. Currently there is no single tool that combines spot discovery (geotagged photos from the community, points of interest) with shooting conditions (weather, golden hour, cloud cover) in one place. Photographers have to juggle multiple apps and websites to gather this information, and have no way to track which spots they have already visited or want to revisit.

## Solution

A web application where a user types in a location (e.g. "Leonberg") and receives up to 30 nearby photo spot suggestions, sourced from geotagged community photos (Flickr, 500px) and generic points of interest (OpenStreetMap/Overpass as fallback). Each spot shows its exact location on a map, distance from the searched location, current weather, golden hour times, and cloud cover — all fetched on demand. Users can favorite spots to revisit later and log visits with a date and personal notes. The app stores recent searches and persists all user data in a backend database, designed from day one to support multiple independent user accounts.

## User Stories

1. As a photographer, I want to type a city or place name into a search bar, so that I can discover nearby photo spots without knowing coordinates.
2. As a photographer, I want to set a search radius, so that I can control how far from my target location the suggestions reach.
3. As a photographer, I want to see up to 30 nearby photo spots per search, so that I get a meaningful set of options without being overwhelmed.
4. As a photographer, I want results displayed as a list on the left and a map on the right simultaneously, so that I can scan options and understand their geographic spread at the same time.
5. As a photographer, I want spots sourced from geotagged photos on Flickr and 500px, so that I see places other photographers have found interesting.
6. As a photographer, I want the app to fall back to OpenStreetMap points of interest (viewpoints, parks, landmarks) when photo APIs return sparse results, so that I always see useful suggestions.
7. As a photographer, I want to click on a spot in the list or on the map to open a detail view, so that I can learn more about it before deciding to visit.
8. As a photographer, I want the spot detail view to show the exact location on a map, so that I know precisely where to go.
9. As a photographer, I want the spot detail view to show the distance from my searched location, so that I can gauge travel effort.
10. As a photographer, I want the spot detail view to show current weather conditions (temperature, conditions), so that I know if it is worth going today.
11. As a photographer, I want the spot detail view to show today's sunrise and sunset (golden hour) times, so that I can plan my shoot around the best light.
12. As a photographer, I want the spot detail view to show current cloud cover percentage, so that I can assess whether the sky will be interesting or flat.
13. As a photographer, I want the spot detail view to show sample photo thumbnails from Flickr/500px, so that I can visually assess the spot's potential.
14. As a photographer, I want weather, golden hour, and cloud cover data to be fetched on demand when I open a spot, so that the information is always current.
15. As a photographer, I want to favorite a spot from its detail view, so that I can save it for future reference without having to search again.
16. As a photographer, I want to unfavorite a spot, so that I can keep my favorites list clean.
17. As a photographer, I want to mark a spot as visited, so that I can track where I have already been.
18. As a photographer, I want to log a date when marking a spot as visited, so that I can remember when I shot there.
19. As a photographer, I want to add personal notes when logging a visit, so that I can record conditions, tips, or impressions for next time.
20. As a photographer, I want to log multiple visits to the same spot with different dates and notes, so that I can track how a location changes across seasons or lighting conditions.
21. As a photographer, I want a "My Spots" dashboard, so that I can see all my saved and visited spots in one place.
22. As a photographer, I want the dashboard to have separate tabs for Favorites and Visited, so that I can navigate between my two lists easily.
23. As a photographer, I want each visited entry to show the date and notes I logged, so that I can review my history at a glance.
24. As a photographer, I want to mark a spot as visited directly from my Favorites list, so that I do not have to search for it again.
25. As a photographer, I want the app to remember my recent searches, so that I can quickly repeat a previous search without retyping.
26. As a photographer, I want recent searches to be stored in the backend, so that they persist across devices and sessions.
27. As a photographer, I want to register with an email and password, so that my data is private and persists between sessions.
28. As a photographer, I want to log in with my email and password, so that I can access my spots from any device.
29. As a photographer, I want my session to persist (via JWT), so that I do not have to log in on every visit.
30. As a photographer on mobile, I want the map to be the default view, so that I can immediately see spots spatially when I open the app in the field.
31. As a photographer on mobile, I want to toggle between map and list view, so that I can switch to a scrollable list when I need to scan results quickly.
32. As a photographer, I want map tiles to use OpenStreetMap (free), so that the app has no usage costs associated with maps.

## Implementation Decisions

### Modules

**Auth Module**
Handles user registration, login, logout, and JWT issuance/validation. Designed for username/password now; the interface is intentionally decoupled so OAuth providers can be added later (Phase 2+) without changing how the rest of the app calls auth.

**Geocoding Module**
Converts a free-text location query into lat/lng coordinates using Nominatim (OpenStreetMap, free). Returns a display name alongside coordinates. Interface: `geocode(query) → { lat, lng, displayName }`.

**Spot Discovery Module**
Given lat/lng and a radius, queries Flickr and 500px for geotagged photos and OpenStreetMap/Overpass for POIs (viewpoints, parks, landmarks). Merges and deduplicates results, caps at 30. Falls back to OSM-only when photo APIs return sparse or no results. Interface: `discoverSpots(lat, lng, radiusKm) → Spot[]`. Spot discovery is live (no ETL or caching) in Phase 1.

**Spot Detail Module**
Fetches all condition data on demand for a given lat/lng: current weather and cloud cover from OpenWeatherMap, sunrise/sunset from SunriseSunset.io, and sample photo thumbnails from Flickr/500px. Interface: `getSpotDetails(lat, lng) → SpotDetails`.

**External API Adapters**
One thin adapter per external service: OpenWeatherMap, SunriseSunset.io, Flickr, 500px, Nominatim, Overpass. Each adapter wraps the external API behind a consistent internal interface so services are swappable without touching business logic.

**User Spots Module**
CRUD operations for favorites and visits against the shared `spots` table. Favorites are one-per-(user, spot). Visits allow multiple entries per (user, spot) to support repeat visits. Interface: `addFavorite`, `removeFavorite`, `markVisited`, `getUserSpots`.

**Recent Searches Module**
Persists and retrieves the last N searches per user. Interface: `saveSearch(userId, query)`, `getRecentSearches(userId)`.

### Database Schema

- `users` — id, email, password_hash, created_at
- `spots` — id, name, lat, lng, source (flickr/500px/osm), tags[] (silent, no UI in Phase 1), external_url, created_at
  - Spots are **shared entities**, not owned by any user. This enables a community view in a future phase without migration.
- `user_favorites` — user_id, spot_id, created_at *(one row per spot — simple toggle)*
- `user_visits` — user_id, spot_id, visited_date, notes, created_at *(multiple rows per spot allowed)*
- `recent_searches` — user_id, query, searched_at

PostGIS extension on Postgres for geo-indexing and radius queries.

### Architectural Decisions

- **Next.js 15** as the full-stack framework (React frontend + API routes backend).
- **Leaflet.js + OpenStreetMap tiles** for all maps (free, no API key required).
- **Tailwind CSS** for styling.
- **Docker Compose** to orchestrate app container + Postgres container locally.
- **Prisma ORM** for database access and migrations.
- **JWT** stored in httpOnly cookies for session management.
- **Split layout**: list left, map right on desktop; map first with toggle on mobile.
- **No real-time updates** in Phase 1 — weather and conditions are fetched on demand when a spot detail is opened.
- **No ETL / caching** in Phase 1 — all external API calls are live. Caching layer can be introduced in a later phase if performance becomes an issue.
- **tags field** added as a Postgres array on `spots` now (zero extra cost) to avoid a migration when tag filtering is introduced in a later phase. No tag UI in Phase 1.

## Testing Decisions

A good test covers only external behavior observable through the module's public interface — not internal implementation details like which internal function was called or how data was structured internally. Tests should remain valid even if the internals are completely rewritten.

**Modules to test:**

- **Auth Module** — test registration, login, token issuance, invalid credentials, duplicate email. Prior art: standard JWT integration tests with a real test database.
- **Spot Discovery Module** — test that results are capped at 30, that deduplication works, and that the OSM fallback triggers when photo APIs return empty. Use mock HTTP adapters for external API calls at the adapter boundary.
- **Spot Detail Module** — test that the correct data shape is returned when all APIs succeed, and that partial failures (one API down) are handled gracefully.
- **User Spots Module** — test adding/removing favorites, logging multiple visits to the same spot, and retrieving the full user spots list. These tests should hit a real test database (not mocked), to catch any schema or query issues.

## Out of Scope (Phase 1)

- EXIF photo upload and GPS extraction
- Social / OAuth login (Google, GitHub)
- Community view (browsing other users' spots)
- Tag/category filtering UI
- ETL pipelines or scheduled background jobs
- Caching layer for spot or weather data
- Map overlays showing previously visited spots alongside search results
- Push notifications or real-time weather updates
- Redis / BullMQ job queues

## Further Notes

- The `spots` table is intentionally shared across users from day one. When a community view is added later, the data model requires no migration — only new query patterns and access controls.
- Social login (Phase 2+) can be added by extending the Auth Module with an OAuth provider adapter without changing any other module.
- Live API fetching keeps Phase 1 simple but will become a bottleneck at scale. The architecture allows introducing a caching layer (Redis + TTL-based invalidation) in a later phase without changing the Spot Discovery or Spot Detail module interfaces.
- The 30-result cap is both a UX decision (avoid overwhelming the user) and a practical guard against API rate limits in Phase 1.
