import { ItemCard } from './ItemCard.js';

export class DayColumn {
  constructor(dayIndex, dateLabel) {
    this.dayIndex = dayIndex;
    this.dateLabel = dateLabel;
  }

  render() {
    const column = document.createElement('div');
    column.className = 'day-column';

    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = this.dateLabel;

    const segments = ['morning', 'afternoon', 'evening'];
    const segmentContainers = segments.map(segment => {
      const seg = document.createElement('div');
      seg.className = `segment ${segment}`;
      seg.dataset.segment = segment;
      seg.dataset.dayIndex = this.dayIndex;
      seg.innerHTML = `<h4>${segment.charAt(0).toUpperCase() + segment.slice(1)}</h4>`;
      // Placeholder: render items for this segment
      // In future, filter trip items by dayIndex and segment
      return seg;
    });

    column.appendChild(header);
    segmentContainers.forEach(seg => column.appendChild(seg));
    return column;
  }
}
