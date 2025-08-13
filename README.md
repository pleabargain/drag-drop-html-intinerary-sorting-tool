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

## Phase Two Implementation

### Manual Testing Instructions

To test the item card rendering:

1. Open the browser console and reload the app.
2. Paste the following code into the console:
   ```js
   const item = {
     id: 'test1',
     title: 'Test Activity',
     dayIndex: 0,
     segment: 'morning',
     startTime: '09:00',
     durationMinutes: 60,
     cost: 25
   };
   const card = new ItemCard(item).render();
   document.querySelector('.segment.morning[data-day-index="0"]').appendChild(card);
   ```
3. You should see a card appear under Day 1 → Morning with:
   - Title: "Test Activity"
   - Time: "09:00 (60 min)"
   - Cost: "$25"
4. Confirm layout and styling match expectations.
5. Ensure no console errors occur.


Phase 2 added the first visible UI layout for the trip days:

- Implemented `DayColumn` component to render each day with morning, afternoon, and evening segments.
- Updated `app.js` to render all trip days dynamically.
- Styled the layout using `main.css` for responsive columns and segment blocks.

### What to Expect
- The UI now displays a column for each day with labeled segments.
- The layout is responsive and styled for clarity.

### Next Steps

### Item Rendering Test Instructions

To test automatic item rendering from localStorage:

1. Open the browser console and paste:
   ```js
   const trip = JSON.parse(localStorage.getItem('currentTrip'));
   trip.days[0].items.push({
     id: 'test1',
     title: 'Test Activity',
     category: 'activity',
     dayIndex: 0,
     segment: 'morning',
     startTime: '09:00',
     durationMinutes: 60,
     cost: 25,
     status: 'active'
   });
   localStorage.setItem('currentTrip', JSON.stringify(trip));
   location.reload();
   ```
2. You should see the item card appear under Day 1 → Morning.
3. Confirm the card displays:
   - Title: "Test Activity"
   - Time: "09:00 (60 min)"
   - Cost: "$25"
4. Ensure no console errors occur.
- Add item card rendering logic inside each segment.
- Enable item creation and editing.
- Display per-day and trip-level cost totals.
- Begin wiring up item CRUD operations.

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
