## url
https://github.com/pleabargain/drag-drop-html-intinerary-sorting-tool

## Multi‑Day Itinerary Planner (HTML + JavaScript)

A simple, client‑side tool to plan multi‑day itineraries with drag‑and‑drop across days and day segments (morning/afternoon/evening). Items have durations and optional costs. The app calculates per‑day totals and an overall trip total and supports overnight stays.

- See `Software Requirements Document.md` for the full SRS and clarification log.
- No backend. Data is stored locally (planned via `localStorage`) with JSON import/export.

- Currency is user‑selectable; formatting follows the system locale when available (fallback to a locale appropriate for the currency).
- Overnight stay costs are attributed entirely to the start calendar day (24‑hour day rule).
- Save/Open/Edit/Save supported with JSON Schema validation for file integrity.
- Start time snapping is 60 minutes (1‑hour increments).
 - No time overlaps are allowed; adjust start time/duration to resolve conflicts.
 - Save As: export itinerary as JSON (new filename) or as a standalone interactive HTML that can be re‑saved as JSON/HTML.

Last updated: 2025-08-13

## Phase One Implementation

Phase 1 established the foundational structure of the application:

- Created `index.html` with semantic layout and script/style includes.
- Implemented base CSS files: `main.css`, `components.css`, `responsive.css`.
- Built core JavaScript modules:
  - `Trip`, `Item`, and `Category` models
  - `StorageService` for localStorage persistence
  - `ValidationService` placeholder
  - `IdGenerator` for unique IDs
- Initialized a default trip and saved it to localStorage.
- Confirmed JSON structure and browser console logging.
- No UI rendering yet — visual components begin in Phase 2.
