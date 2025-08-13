export class DragDropManager {
  constructor(trip) {
    this.trip = trip;
    this.draggedItem = null;
    this.init();
  }

  init() {
    document.addEventListener('dragstart', this.handleDragStart.bind(this));
    document.addEventListener('dragover', this.handleDragOver.bind(this));
    document.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragStart(e) {
    const card = e.target.closest('.item-card');
    if (!card) return;
    this.draggedItem = card.dataset.itemId;
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(e) {
    if (e.target.closest('.segment')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  }

  handleDrop(e) {
    const target = e.target.closest('.segment');
    if (!target || !this.draggedItem) return;

    const dayIndex = parseInt(target.dataset.dayIndex, 10);
    const segment = target.dataset.segment;

    const item = this.findItemById(this.draggedItem);
    if (!item) return;

    // Remove from original day
    const originalDay = this.trip.days[item.dayIndex];
    originalDay.items = originalDay.items.filter(i => i.id !== item.id);

    // Update item
    item.dayIndex = dayIndex;
    item.segment = segment;
    item.startTime = this.snapToSegmentStart(segment);

    // Add to new day
    this.trip.days[dayIndex].items.push(item);

    localStorage.setItem('currentTrip', JSON.stringify(this.trip));
    location.reload();
  }

  findItemById(id) {
    for (const day of this.trip.days) {
      const match = day.items.find(i => i.id === id);
      if (match) return match;
    }
    return null;
  }

  snapToSegmentStart(segment) {
    const bounds = this.trip.segmentBoundaries[segment];
    return bounds ? bounds[0] : '08:00';
  }
}
