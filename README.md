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

### Debug Tools

Two buttons have been added to the UI for development and testing:

- **Clear All Memory**: Clears all localStorage data and reloads the app.
- **Show All Memory**: Displays the current contents of localStorage in a popup.

These tools help prevent duplication and allow inspection of the app's memory state.

### Known Issues with Console Testing

### Debugging the Duplicate Item Bug

This was one of the most difficult bugs to isolate and fix. The root cause was a mismatch between where items were stored (`trip.days[X].items`) and what their `dayIndex` claimed. This caused items to appear multiple times or in the wrong place.

Key challenges:
- Items were not being moved between day arrays when dragged.
- Rendering logic trusted the array location, not the `dayIndex`.
- Debug buttons and console injection could silently introduce inconsistencies.
- The app auto-saves on load, which could overwrite test data before it was visible.

Fixes included:
- Reassigning items to the correct day array before rendering.
- Adding stricter duplicate checks in debug tools.
- Improving the "Show All Memory" tool to allow copy-paste inspection in a scrollable window.

- Injecting items via console often results in duplicates.
- This is due to the app auto-saving a default trip on load, which may overwrite or merge with injected data.
- JSON structure mismatches or race conditions can cause trip data to be malformed or duplicated.

### Recommendations

- Use the new debug buttons instead of console injection.
- If using the console, always check for existing item IDs before pushing.
- Consider adding a "Reset Trip" utility in the app for clean test states.

### Next Steps

### Item Rendering Test Instructions

To inject 3 unique items for drag-and-drop testing:

```js
const trip = JSON.parse(localStorage.getItem('currentTrip'));
trip.days[0].items = [
  {
    id: 'item-' + Math.random().toString(36).slice(2),
    title: 'Museum Visit',
    category: 'activity',
    dayIndex: 0,
    segment: 'morning',
    startTime: '08:00',
    durationMinutes: 60,
    cost: 15,
    status: 'active'
  },
  {
    id: 'item-' + Math.random().toString(36).slice(2),
    title: 'Lunch at Cafe',
    category: 'meal',
    dayIndex: 0,
    segment: 'afternoon',
    startTime: '12:00',
    durationMinutes: 60,
    cost: 20,
    status: 'active'
  },
  {
    id: 'item-' + Math.random().toString(36).slice(2),
    title: 'Evening Show',
    category: 'activity',
    dayIndex: 0,
    segment: 'evening',
    startTime: '18:00',
    durationMinutes: 90,
    cost: 40,
    status: 'active'
  }
];
localStorage.setItem('currentTrip', JSON.stringify(trip));
location.reload();
```

You should now be able to drag each item to a different segment or day.

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
