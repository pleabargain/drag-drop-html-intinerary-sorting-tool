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


