## Multi‑Day Itinerary Planner — Software Requirements Document (SRS)

### 1. Overview
This document specifies a simple, client‑side HTML + JavaScript tool that allows users to create and manage a multi‑day travel itinerary. Users can drag and drop itinerary items across days and within day segments (morning, afternoon, evening). Items have estimated durations and optional costs. The system maintains per‑day and trip‑level cost totals and supports overnight stays.

### 2. Goals
- Enable creation and editing of multi‑day itineraries completely in the browser, no backend required.
- Support intuitive drag‑and‑drop reordering within a day and moving items across days/segments.
- Maintain temporal consistency when an item is moved (e.g., moving to afternoon adjusts the item’s start time/segment accordingly).
- Track costs per item, show daily totals, and a trip total. Allow empty/unknown costs.
- Include overnight stays as itinerary items.
- Allow the user to specify the trip currency.

### 3. Non‑Goals
- Multi‑user collaboration or real‑time sync.
- Authentication or server‑side storage.
- Complex optimization (e.g., automatic routing or travel time estimation).

### 4. Users and Personas
- Casual travelers planning trips.
- Power users planning detailed daily schedules.

### 5. Glossary
- Itinerary Item ("itin object"): An activity, meal, transport, or lodging/overnight stay with fields like title, description, estimated start time, estimated duration, and cost.
- Day Segment: A logical part of a day: morning, afternoon, evening.
- Trip: A collection of days containing itinerary items.

Process Note: We have reached 90%+ confidence in the goals and desired product. All major requirements have been clarified and documented.
LLM Collaboration Process Notes:
- The assistant will ask one question at a time to clarify requirements.
- After each user response, this SRD will be updated immediately with the new decision, and the Q&A will be logged under Decisions & Clarifications.
- The assistant will continue this process until it reaches at least 90% confidence in the user’s goals and the desired software product.
- No documents will be deleted or renamed without explicit user approval; changes will be tracked in the Decisions log.

### 6. Assumptions (Subject to Clarification)
- The day is partitioned into three segments with default boundaries:
  - morning 08:00–12:00
  - afternoon 12:00–17:00
  - evening 17:00–22:00
- Segment boundaries are editable per item, allowing fine-grained control over time windows for specific itinerary entries.
- Time granularity is in minutes; display snaps to a 60‑minute grid.
- Single‑currency display per trip (selected by the user; symbol/code configurable; default is the system locale’s currency for new trips).
- Currency formatting uses the system default locale when available. If unavailable, it falls back to a locale appropriate for the selected currency (e.g., `en-US` for USD, `de-DE` for EUR) via `Intl.NumberFormat`.
- Data persists locally (e.g., `localStorage`) with import/export as JSON.
 - Calendar dates are optional. If a trip start date is provided, each day gets an auto‑computed calendar date by adding N−1 days using the trip timezone; otherwise days are shown as Day 1, Day 2, … without dates.
 - Trip timezone defaults to the system timezone unless the user selects a specific timezone.

### 7. Functional Requirements

#### 7.1 Trip Management
- Create a new trip specifying number of days (N ≥ 1).
- Add/remove days; renumber days sequentially.
- Import/export trip data as JSON.
- Set or change the trip currency (ISO 4217 code and display symbol). Changing currency updates displayed totals without performing FX conversion (unless later specified).
 - Default currency is auto‑selected from the system locale when creating a new trip.
 - Optional calendar dating: user can set a trip start date and a trip timezone. When set, day headers show calendar dates (auto‑incremented per day). Users can toggle date display off to revert to Day 1/2/… labels without altering underlying data.
 - Manage categories: create custom categories (name, color, icon), edit/rename, and delete. Deleting a category that is in use must either be blocked or require reassignment of affected items to another category.
 - Changing the start date or number of days reflows the derived dates accordingly.

#### 7.2 Itinerary Item CRUD
- Create, read, update, delete items with fields:
  - id (generated)
  - title (required)
  - description (optional)
  - category (string): references either one of the default categories (activity, meal, transport, overnight, other) or any user‑defined custom category
  - dayIndex (0‑based)
  - segment (enum): morning | afternoon | evening
  - startTime (HH:MM, optional; derived/snapped when using drag‑drop)
  - durationMinutes (integer ≥ 0; default 0, required for validation)
  - cost (number or null; empty cost allowed, default null)
  - mapUrl (string, optional; URL to map/location)
  - contactNumber (string, optional; contact phone)
  - notes (optional)
  - status (enum): active | on-hold (default: active)
- Quick Add: Rapid creation of multiple items with minimal input (title and category only). Items are created with default duration (60 minutes) and placed at the next available time slot in the selected day/segment. Users can then edit details later.
- Duplicate Item: Copy an existing item to another day/segment. The duplicated item retains all original properties (title, description, duration, cost, map URL, contact number, notes) but gets a new unique ID and is placed at the next available time slot in the target day/segment.
- Item Status Management: Users can remove items from the active itinerary by setting their status to "on-hold" rather than permanently deleting them. On-hold items are stored separately and can be reactivated later. On-hold items do not appear in the main itinerary view or contribute to cost totals.

#### 7.3 Drag & Drop Behavior
- Drag within a day to reorder items; list reorders by time after drop.
- Drag across days and segments; upon drop:
  - item.dayIndex becomes target day
  - item.segment becomes target segment
  - item.startTime snaps within the segment according to ordering rules (see 7.4)
- Visual drop indicators show valid targets (day/segment columns/lanes).
 - Drops that would cause a time overlap are rejected with a message. The conflicting items are highlighted and the user is prompted to adjust start time and/or duration.

#### 7.4 Scheduling and Time Rules
- Each segment has the following time windows. Start times must fall within the segment’s window.
  - morning: 08:00–12:00
  - afternoon: 12:00–17:00
  - evening: 17:00–22:00
- When an item is moved into a segment:
  - If it has an existing startTime, snap to the closest valid time inside the segment window.
  - Otherwise, place after the last item in that segment (or at segment start if empty).
- Items are displayed ordered by startTime within each segment; if equal/unspecified, preserve manual order of insertion.
- Items snap to 60‑minute increments within the segment window.
- Estimated duration may span segment boundaries visually; the segment affiliation determines listing location. If a duration overflows the day end, show an overflow indicator.
 - Time overlaps are not allowed: for any day, no two items may have intersecting [start, end) intervals based on `startTime` and `durationMinutes`, regardless of segment. Creation/move/edit must enforce this.
 - If a trip timezone is set, all times are interpreted and displayed in that timezone; otherwise the system timezone is used.

#### 7.5 Overnight Stays
- Overnight items represent lodging and are assigned to a specific day and segment (default: evening, unless specified).
- Display overnight items distinctly (e.g., bed icon). They may have zero/empty cost.
- Cost attribution rule: attribute the entire overnight cost to the start calendar day (the day identified by the item's `dayIndex` and `startTime`), consistent with a 24‑hour day (all cost on that day).

#### 7.6 Cost Calculation
- Per‑day total = sum of costs of items assigned to that day with status "active". Items with unknown/empty cost (null/NaN) are treated as 0 for calculation.
- Trip total = sum of per‑day totals.
- Display totals using the user‑selected currency. Show currency symbol/code alongside totals (default currency TBD). No automatic currency conversion is performed.
- Overnight items' costs are included entirely in the total of their start calendar day.
- Unknown‑cost items are surfaced in an "Assumed 0" list showing the item titles at the day level and a combined list at the trip level.
- On-hold items do not contribute to cost calculations.

#### 7.7 Persistence & Data Portability
- Auto‑save to `localStorage` on changes.
- Save (Export): User can save the current trip to a JSON file (`Save`), downloading `trip-<name>-<YYYYMMDD>.json`. JSON is validated against the schema before export.
- Open (Import): User can open a previously saved JSON file. The file is validated against the schema; on success, the planner loads it and replaces in‑memory data. On failure, show validation errors.
- Edit: User can modify items/days; changes are reflected immediately and auto‑saved locally.
- Save again: Trigger `Save` to download an updated JSON reflecting current edits. If the File System Access API is available, support in‑place save to the originally opened file (user permission required); otherwise, default to download.
 - Save As (JSON): User can export the itinerary JSON under a new filename via a standard Save As flow.
 - Save As (HTML): User can export a standalone HTML version that is fully interactive (same editing capabilities) and supports re‑saving changes either as JSON or as another HTML file. The export is self‑contained for easiest sharing: all JS/CSS are embedded; no external assets are required.
 - Print/Export to PDF: User can generate a PDF version of the itinerary for sharing or printing. The PDF includes all trip details, daily schedules with items organized by segment, cost totals, and any notes. The PDF is optimized for both screen viewing and printing.

#### 7.8 Accessibility & Keyboard Support
- Keyboard navigation for moving focus across items and segments.
- Keyboard alternatives for drag‑drop (e.g., move item up/down, move to previous/next segment/day).
- ARIA roles for lists and draggable items.

#### 7.9 Testing & Development Support
- Lightweight testing harness accessible via keyboard shortcut (Ctrl+Shift+T) or hidden menu.
- Test functions for drag-and-drop functionality with sample items.
- Verification of time snapping to 60-minute increments.
- Cost calculation accuracy testing with known test data.
- Time overlap prevention validation.
- Export function testing (JSON, HTML, PDF).
- Console logging for debugging and development.

#### 7.10 Responsiveness
- Layout adapts from desktop (multi‑column) to mobile (stacked segments with tabs or accordions).

### 8. Non‑Functional Requirements
- Performance: Reordering should feel instant for up to 300 items across a 30‑day trip.
- Compatibility: Latest Chrome, Edge, Firefox, Safari.
- No server dependency; works offline after first load.
- Language Quality: All UI text and this document use correct, clear English. Grammar and spelling are enforced; American English by default unless specified otherwise.
- Change Management: No files/documents are deleted without explicit user approval.

### 9. Data Model (JSON Schema and Template)

#### 9.1 JSON Schema (for validation on Open/Save)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/itinerary.schema.json",
  "title": "ItineraryTrip",
  "type": "object",
  "required": ["trip"],
  "properties": {
    "trip": {
      "type": "object",
      "required": ["currency", "segmentBoundaries", "days"],
      "properties": {
        "name": { "type": "string" },
        "currency": { "type": "string", "minLength": 1 },
        "categories": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["key", "name"],
            "properties": {
              "key": { "type": "string", "minLength": 1 },
              "name": { "type": "string", "minLength": 1 },
              "color": { "type": "string", "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" },
              "icon": { "type": "string" }
            },
            "additionalProperties": false
          }
        },
        "segmentBoundaries": {
          "type": "object",
          "required": ["morning", "afternoon", "evening"],
          "properties": {
            "morning": {
              "type": "array",
              "prefixItems": [
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" },
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" }
              ],
              "minItems": 2,
              "maxItems": 2
            },
            "afternoon": {
              "type": "array",
              "prefixItems": [
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" },
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" }
              ],
              "minItems": 2,
              "maxItems": 2
            },
            "evening": {
              "type": "array",
              "prefixItems": [
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" },
                { "type": "string", "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" }
              ],
              "minItems": 2,
              "maxItems": 2
            }
          },
          "additionalProperties": false
        },
        "days": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["items"],
            "properties": {
              "date": { "type": ["string", "null"], "format": "date" },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "id",
                    "title",
                    "category",
                    "dayIndex",
                    "segment",
                    "durationMinutes"
                  ],
                                     "properties": {
                     "id": { "type": "string", "minLength": 1 },
                     "title": { "type": "string", "minLength": 1 },
                     "description": { "type": "string" },
                     "category": { "type": "string", "minLength": 1 },
                     "dayIndex": { "type": "integer", "minimum": 0 },
                     "segment": {
                       "type": "string",
                       "enum": ["morning", "afternoon", "evening"]
                     },
                     "startTime": {
                       "type": ["string", "null"],
                       "pattern": "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                     },
                     "durationMinutes": { "type": "integer", "minimum": 0 },
                     "cost": { "type": ["number", "null"] },
                     "mapUrl": { "type": "string", "format": "uri" },
                     "contactNumber": { "type": "string" },
                     "notes": { "type": "string" },
                     "status": {
                       "type": "string",
                       "enum": ["active", "on-hold"],
                       "default": "active"
                     }
                   },
                  "additionalProperties": false
                }
              }
            },
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

#### 9.2 Starter JSON Template (example save/open file)
```json
{
  "trip": {
    "name": "My Trip",
    "currency": "USD",
    "segmentBoundaries": {
      "morning": ["08:00", "12:00"],
      "afternoon": ["12:00", "17:00"],
      "evening": ["17:00", "22:00"]
    },
    "days": [
      {
        "date": null,
        "items": [
          {
            "id": "1",
            "title": "Hotel Check‑in",
            "description": "Overnight stay at City Hotel",
            "category": "overnight",
            "dayIndex": 0,
            "segment": "evening",
            "startTime": "18:00",
            "durationMinutes": 720,
            "cost": null,
            "mapUrl": "https://maps.google.com/?q=City+Hotel",
            "contactNumber": "+1-555-000-0000",
            "notes": "Request late checkout"
          }
        ]
      }
    ]
  }
}
```

### 10. UI/UX Overview
- Trip header: trip name, number of days, currency selector, import/export, print/PDF.
- Main planner: for each day, three segment lanes (morning, afternoon, evening) containing item cards.
 - Item card: title, time range, duration, cost, category icon/color; drag handle; optional map link and contact button.
- Totals: per‑day total in each day header; trip total in the main header/footer.
 - Category manager: UI to add/edit/delete categories (name, color, icon) and reassign items if a category is deleted.
 - Quick Add panel: Streamlined interface for rapidly creating items with just title and category selection.
 - Item context menu: Options to edit, duplicate, put on-hold, or permanently delete individual items.
 - On-hold items panel: Separate view showing all on-hold items with options to reactivate or permanently delete them.
 - Testing panel: Hidden interface accessible via Ctrl+Shift+T for development and maintenance testing.

### 11. Validation & Error Handling
- Cost input accepts numbers; empty value allowed (stored as null).
- Duration must be ≥ 0.
- `startTime` validated as HH:MM (24‑hour) and constrained to the segment window on drop.
- `mapUrl` minimally validated as a URI; clicking opens a new tab.
- Import/Open validates against the JSON Schema and reports readable errors (field path, expected vs actual).
- Items with unknown/empty cost are flagged in the UI and listed in an "Assumed 0" section for transparency.
 - Overlap validation: On create/move/edit, if the item would overlap any existing item on the same day, block the operation and present guidance to adjust duration or start time.
 - Category validation: Category names must be unique (case‑insensitive) within a trip; color must be a valid hex; icon is a short string (emoji or up to 3 visible glyphs). Items must reference an existing category.
 - Date validation: If a start date is provided, validate it as an ISO date. Timezone selection must be a valid IANA timezone identifier when supported by the platform; otherwise fall back to system timezone.

### 12. Acceptance Criteria (Samples)
- Moving an item from morning to afternoon updates its `segment` and snaps its `startTime` within the afternoon window.
- Per‑day and trip totals update immediately when costs change or items are moved.
- Overnight items can be added, displayed distinctly, and their total cost is attributed entirely to the start calendar day.
- Items snap to 60‑minute increments within their segment.
- Items with unknown cost are treated as 0 in totals, and their titles appear under an "Assumed 0" list per day and for the trip.
 - Attempting to drop or save an item that overlaps another item on the same day is prevented; the UI highlights conflicts and prompts for adjustments.
- With JavaScript disabled, the static page loads but planner interactions are unavailable.
 - Users can create a custom category and assign an item to it; deleting a used category prompts to reassign affected items.
 - When a trip start date and timezone are set, Day 1 shows that calendar date and subsequent days auto‑increment; toggling date display off hides dates while retaining scheduling integrity.
 - PDF export generates a well‑formatted document with all trip details, daily schedules, cost totals, and notes suitable for both screen viewing and printing.
 - Quick Add creates items with default 60‑minute duration and places them at the next available time slot in the selected day/segment.
 - Duplicate item creates a copy with all original properties and places it at the next available time slot in the target day/segment.
 - Putting an item on-hold removes it from the main itinerary view and cost totals, but preserves all item data for potential reactivation.
 - Testing harness provides comprehensive verification of core functionality including drag-drop, time snapping, cost calculations, and export features.

### 13. Open Questions
*All questions have been resolved. The requirements are now 90%+ complete.*

### 14. Decisions & Clarifications Log
- Q17: Should the planner support editing the default segment time boundaries (e.g., changing morning from 08:00–12:00 to 07:00–11:00), or are they fixed for all trips?
  - Answer: Editable per item — each itinerary item can override the default segment boundaries if needed.
- Q1: Define exact time boundaries for morning, afternoon, evening.
  - Answer: morning 08:00–12:00, afternoon 12:00–17:00, evening 17:00–22:00.
- Q2: How should overnight stay costs be attributed in daily totals (count on start day only, split across nights, or user‑selectable)?
  - Answer: Attribute the entire cost to the start day (24‑hour day; all costs on that date).
 - Q3: Do you want a lightweight testing function/harness included to verify drag‑drop, time snapping, and cost totals in the browser console/UI?
   - Answer: Yes — testing functionality is included for development and maintenance.
- Q4: What time snapping granularity should be used?
  - Answer: 60 minutes (1 hour).
- Q6: What should the default currency be for new trips?
  - Answer: Use the system locale’s currency.
 - Q7: Should days have calendar dates or be numbered only?
  - Answer: Calendar date is optional; if a start date and timezone are set, dates are auto‑computed per day, otherwise show numbered days only.
- D1: Currency is user‑selectable per trip; stored with the trip and applied to all displayed totals. Default currency remains TBD.
- D2: Currency formatting uses the system default locale when available; otherwise falls back to a locale appropriate for the selected currency (via `Intl.NumberFormat`).
- D3: Snapping granularity is fixed at 60 minutes.
 - D4: Unknown‑cost handling is standardized as per Q5.
 - D5: Process policy — no documents are deleted without explicit user approval.
 - D6: Time overlaps are not allowed; users must adjust start time and/or duration to resolve conflicts.
 - D7: Save As options include JSON and standalone interactive HTML export with re‑save to JSON/HTML.
 - D8: Interactive HTML export must be self‑contained (all JS/CSS embedded) for easiest sharing.
  - D9: Default currency for new trips is the system locale’s currency (auto‑selected).
  - D10: Calendar dates are optional and derived from start date/timezone when provided; otherwise days are numbered.
- Q5: How should unknown costs be handled in totals?
  - Answer: Treat unknown costs as 0 in totals and list the item titles under an "Assumed 0" section per day and for the trip.
- D4: Unknown‑cost handling is standardized as per Q5.
- D5: Process policy — no documents are deleted without explicit user approval.
  - Q8: Should users be able to add custom categories beyond the defaults?
   - Answer: Yes — users can define custom categories with name/icon/color.
 - D11: Custom categories are supported; items reference category by string key/name.
 - Q9: Do you want per‑day and trip budget targets with warnings/highlights when totals exceed the targets?
   - Answer: No — budget targets are not included.
 - D12: Budget targets are not part of the feature set.
 - Q10: Should the planner include a print/export to PDF feature for sharing or printing the itinerary?
   - Answer: Yes — PDF export is included for sharing and printing.
 - D13: PDF export functionality is included with trip details, daily schedules, cost totals, and notes.
 - Q11: Should the planner include a search/filter feature to find specific items across all days?
   - Answer: No — search/filter functionality is not included.
 - D14: Search/filter functionality is not part of the feature set.
 - Q12: Should the planner include a "quick add" feature to rapidly create multiple items with minimal input (just title and category)?
   - Answer: Yes — quick add functionality is included for rapid item creation.
 - D15: Quick Add functionality is included with default 60‑minute duration and automatic placement at next available time slot.
 - Q13: Should the planner include a "duplicate item" feature to quickly copy an existing item to another day/segment?
   - Answer: Yes — duplicate item functionality is included for copying items.
 - D16: Duplicate item functionality is included with all original properties retained and placement at next available time slot.
 - Q14: Should the planner include a "bulk operations" feature (e.g., select multiple items to move/delete/copy together)?
   - Answer: No — bulk operations are not included.
 - D17: Bulk operations are not part of the feature set.
 - Q15: Should users be able to remove items from the itinerary without permanently deleting them?
   - Answer: Yes — items can be put "on-hold" rather than permanently deleted.
 - D18: Item status management is included with "active" and "on-hold" states; on-hold items are preserved but don't appear in main view or cost totals.
 - Q16: Should the planner include a "templates" feature to save and reuse common itinerary patterns (e.g., "Weekend City Break", "Business Trip")?
   - Answer: No — templates functionality is not included.
 - D19: Templates functionality is not part of the feature set.
 - D20: Testing functionality is included with drag-drop, time snapping, and cost calculation verification capabilities.
Should the planner include a "bulk operations"
