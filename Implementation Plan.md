# Multi-Day Itinerary Planner — Implementation Plan

## 1. Project Overview

This document outlines the implementation strategy for the Multi-Day Itinerary Planner, a client-side HTML/JavaScript application that allows users to create and manage travel itineraries with drag-and-drop functionality, cost tracking, and comprehensive data management.

## 2. Technology Stack

### Core Technologies
- **HTML5**: Semantic markup with modern features
- **CSS3**: Flexbox/Grid layouts, custom properties, responsive design
- **Vanilla JavaScript (ES6+)**: No frameworks for maximum portability
- **Web APIs**: Drag and Drop API, File System Access API (optional), localStorage

### Development Tools
- **Code Editor**: VS Code with extensions for HTML/CSS/JS
- **Version Control**: Git
- **Testing**: Browser developer tools, manual testing
- **Build Process**: None (pure client-side)

## 3. Project Structure

```
itinerary-planner/
├── index.html                 # Main application entry point
├── css/
│   ├── main.css              # Core styles and layout
│   ├── components.css        # Reusable component styles
│   └── responsive.css        # Mobile/tablet adaptations
├── js/
│   ├── app.js               # Main application logic
│   ├── models/
│   │   ├── Trip.js          # Trip data model
│   │   ├── Item.js          # Itinerary item model
│   │   └── Category.js      # Category management
│   ├── services/
│   │   ├── StorageService.js # localStorage operations
│   │   ├── ExportService.js  # JSON/HTML export
│   │   ├── PDFService.js     # PDF generation
│   │   └── ValidationService.js # JSON schema validation
│   ├── ui/
│   │   ├── DragDropManager.js # Drag and drop functionality
│   │   ├── ItemManager.js    # Item CRUD operations
│   │   ├── CategoryManager.js # Category management UI
│   │   └── QuickAddPanel.js  # Quick add functionality
│   └── utils/
│       ├── TimeUtils.js      # Time calculations and formatting
│       ├── CurrencyUtils.js  # Currency formatting
│       └── IdGenerator.js    # Unique ID generation
├── schemas/
│   └── itinerary.schema.json # JSON Schema for validation
└── README.md                 # Project documentation
```

## 4. Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Establish basic project structure and core data models

#### Tasks:
1. **Project Setup**
   - Create project directory structure
   - Set up basic HTML template with semantic markup
   - Implement responsive CSS grid system
   - Create basic JavaScript module structure

2. **Data Models**
   - Implement `Trip` class with all required properties
   - Implement `Item` class with status management
   - Implement `Category` class with custom category support
   - Create JSON Schema validation service

3. **Core Services**
   - Implement `StorageService` for localStorage operations
   - Create `ValidationService` for JSON schema validation
   - Implement `IdGenerator` for unique item IDs

#### Deliverables:
- Basic HTML structure with responsive layout
- Working data models with validation
- localStorage persistence
- JSON import/export functionality

#### Tests to Pass:
- The app loads without errors in the browser and logs "Planner initialized" in the console.
- A new `Trip` object is created and saved to `localStorage` if none exists.
- Reloading the page loads the saved trip from `localStorage`.
- The `Trip`, `Item`, and `Category` classes instantiate correctly and serialize to JSON.
- The `IdGenerator` produces unique IDs.
- The `ValidationService` returns a valid result (placeholder).
- CSS files apply basic layout and responsive styles.

### Phase 2: Core Functionality (Week 2)
**Goal**: Implement basic trip and item management

#### Tasks:
1. **Trip Management**
   - Create new trip functionality
   - Add/remove days
   - Currency selection with system locale detection
   - Optional calendar date support

2. **Item CRUD Operations**
   - Create, read, update, delete items
   - Item status management (active/on-hold)
   - Time snapping to 60-minute increments
   - Time overlap validation

3. **Basic UI Components**
   - Trip header with controls
   - Day/segment layout
   - Item cards with basic information
   - Cost calculation and display

#### Deliverables:
- Functional trip creation and management
- Working item CRUD operations
- Basic UI with item display
- Cost calculation system

#### Debug Tools

Two debug buttons have been added to the UI:

- **Clear All Memory**: Clears localStorage and reloads the app.
- **Show All Memory**: Displays the current localStorage contents in a popup.

These tools help prevent duplication and allow inspection of the app's memory state.

#### Console Testing Issues

- Console-based item injection often results in duplicates.
- This is due to the app auto-saving a default trip on load, which may overwrite or merge with injected data.
- JSON structure mismatches or race conditions can cause trip data to be malformed or duplicated.
- Manual injection without checking for existing IDs can lead to repeated entries.

#### Recommendations

- Use the new debug buttons instead of console injection.
- If using the console, always check for existing item IDs before pushing.
- Consider adding a "Reset Trip" utility in the app for clean test states.

#### What the User Should See:
- A visible trip header rendered at the top of the page.
- The trip name and selected currency displayed in the header.

#### Tests to Perform:

- Inject 3 unique items into localStorage and verify they render and can be moved:
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
- Confirm each item appears in the correct segment.
- Drag each item to a different day and segment.
- Verify the item moves and persists correctly in localStorage.
- Ensure no console errors occur.

- Open the browser console and reload the app.
- Manually inject a test item into a segment:
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
- Confirm the item card appears under Day 1 → Morning.
- Verify the card displays the title, time, and cost.
- Check that the layout and styling match expectations.
- Ensure no console errors occur.
- Confirm the trip header appears on page load.
- Verify the trip name matches the initialized or loaded trip.
- Verify the currency label reflects the trip's currency.
- Check that the header layout is styled and responsive.
- Confirm no console errors occur during rendering.

### Phase 3: Drag and Drop (Week 3)
**Goal**: Implement intuitive drag-and-drop functionality

#### Tasks:
1. **Drag and Drop System**
   - Implement HTML5 Drag and Drop API
   - Visual drop indicators
   - Cross-day and cross-segment movement
   - Time snapping on drop

2. **Scheduling Logic**
   - Segment boundary enforcement
   - Time overlap prevention
   - Automatic time adjustment
   - Visual feedback for conflicts

3. **Enhanced UI**
   - Drag handles and visual cues
   - Drop zone highlighting
   - Conflict resolution UI
   - Smooth animations

#### Deliverables:
- Fully functional drag-and-drop system
- Time conflict prevention and resolution
- Enhanced user experience with visual feedback

### Phase 4: Advanced Features (Week 4)
**Goal**: Implement advanced functionality and polish

#### Tasks:
1. **Quick Add System**
   - Streamlined item creation interface
   - Category selection
   - Default duration assignment
   - Automatic placement

2. **Duplicate Functionality**
   - Item duplication across days/segments
   - Property preservation
   - Smart placement logic

3. **On-Hold Management**
   - On-hold items panel
   - Reactivation functionality
   - Visual distinction from active items

#### Deliverables:
- Quick add panel with rapid item creation
- Duplicate item functionality
- On-hold items management system

### Phase 5: Export and Polish (Week 5)
**Goal**: Complete export functionality and final polish

#### Tasks:
1. **Export Services**
   - JSON export with schema validation
   - Self-contained HTML export
   - PDF generation for printing/sharing
   - File System Access API integration (if available)

2. **Category Management**
   - Custom category creation
   - Category editing and deletion
   - Item reassignment on category deletion
   - Visual category indicators

3. **Final Polish**
   - Accessibility improvements
   - Keyboard navigation
   - Error handling and validation
   - Performance optimization

#### Deliverables:
- Complete export functionality
- Full category management system
- Polished, accessible application

## 5. Technical Implementation Details

### 5.1 Data Architecture

#### Trip Model
```javascript
class Trip {
  constructor(name, currency, days = 1) {
    this.name = name;
    this.currency = currency || this.getSystemCurrency();
    this.segmentBoundaries = {
      morning: ["08:00", "12:00"],
      afternoon: ["12:00", "17:00"],
      evening: ["17:00", "22:00"]
    };
    this.categories = this.getDefaultCategories();
    this.days = this.initializeDays(days);
    this.startDate = null;
    this.timezone = this.getSystemTimezone();
  }
  
  // Methods for day management, cost calculation, etc.
}
```

#### Item Model
```javascript
class Item {
  constructor(title, category, dayIndex, segment, durationMinutes = 60) {
    this.id = IdGenerator.generate();
    this.title = title;
    this.category = category;
    this.dayIndex = dayIndex;
    this.segment = segment;
    this.durationMinutes = durationMinutes;
    this.status = 'active';
    this.startTime = null;
    this.cost = null;
    // Additional properties...
  }
  
  // Methods for time calculation, validation, etc.
}
```

### 5.2 Drag and Drop Implementation

#### DragDropManager
```javascript
class DragDropManager {
  constructor(trip) {
    this.trip = trip;
    this.draggedItem = null;
    this.dropZones = new Map();
    this.initializeEventListeners();
  }
  
  handleDragStart(event) {
    // Initialize drag operation
  }
  
  handleDragOver(event) {
    // Show drop indicators
  }
  
  handleDrop(event) {
    // Process drop with validation
  }
  
  validateDrop(item, targetDay, targetSegment) {
    // Check for time conflicts
  }
}
```

### 5.3 Storage and Persistence

#### StorageService
```javascript
class StorageService {
  static saveTrip(trip) {
    const data = trip.toJSON();
    localStorage.setItem('currentTrip', JSON.stringify(data));
  }
  
  static loadTrip() {
    const data = localStorage.getItem('currentTrip');
    if (data) {
      return Trip.fromJSON(JSON.parse(data));
    }
    return null;
  }
  
  static exportToFile(trip, filename) {
    const data = trip.toJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    // File download logic
  }
}
```

### 5.4 Time and Scheduling Logic

#### TimeUtils
```javascript
class TimeUtils {
  static snapToHour(time) {
    // Snap time to nearest hour
  }
  
  static isWithinSegment(time, segment) {
    // Check if time is within segment boundaries
  }
  
  static findNextAvailableSlot(day, segment, duration) {
    // Find next available time slot
  }
  
  static hasOverlap(item1, item2) {
    // Check for time overlap between items
  }
}
```

## 6. UI/UX Implementation

### 6.1 Layout Structure
- **Header**: Trip name, currency selector, import/export controls
- **Main Area**: Day columns with segment lanes
- **Sidebar**: Quick add panel, category manager, on-hold items
- **Footer**: Trip totals and controls

### 6.2 Responsive Design
- **Desktop**: Multi-column layout with all features visible
- **Tablet**: Collapsible sidebar, touch-friendly controls
- **Mobile**: Stacked layout, simplified interactions

### 6.3 Accessibility Features
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode support

## 7. Testing Strategy

### 7.1 Manual Testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Responsive design testing
- Drag and drop functionality
- Data persistence and export

### 7.2 Automated Testing
- Unit tests for core functions
- Integration tests for data flow
- Validation testing for JSON schema

## 8. Performance Considerations

### 8.1 Optimization Strategies
- Efficient DOM manipulation
- Debounced auto-save
- Lazy loading for large trips
- Memory management for item objects

### 8.2 Scalability
- Support for up to 30 days
- Handle 300+ items efficiently
- Optimized rendering for large datasets

## 9. Deployment and Distribution

### 9.1 Self-Contained Distribution
- Single HTML file with embedded CSS/JS
- No external dependencies
- Works offline after initial load

### 9.2 Export Options
- JSON files for data portability
- Standalone HTML files for sharing
- PDF export for printing

## 10. Future Enhancements

### 10.1 Potential Additions
- Template system for common trip types
- Search and filter functionality
- Bulk operations
- Budget targets and warnings
- Real-time collaboration (future)

### 10.2 Technical Improvements
- Progressive Web App features
- Service Worker for offline functionality
- IndexedDB for larger data storage
- Web Components for modularity

## 11. Success Criteria

### 11.1 Functional Requirements
- All features from SRD implemented
- Drag and drop works smoothly
- Data persistence functions correctly
- Export features work as specified

### 11.2 Quality Requirements
- Responsive design works on all devices
- Accessibility standards met
- Performance targets achieved
- Cross-browser compatibility verified

### 11.3 User Experience
- Intuitive interface design
- Smooth interactions
- Clear error messages
- Helpful feedback for user actions

This implementation plan provides a structured approach to building the Multi-Day Itinerary Planner while ensuring all requirements from the SRD are met with a focus on quality, performance, and user experience.
