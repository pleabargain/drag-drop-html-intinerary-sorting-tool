import { ItemCard } from './ItemCard.js';

export class ItemManager {
  constructor(trip) {
    this.trip = trip;
  }

  renderAll() {
    this.trip.days.forEach((day, dayIndex) => {
      day.items
        .filter(item => item.status === 'active')
        .forEach(item => {
          const selector = `.segment.${item.segment}[data-day-index="${dayIndex}"]`;
          const container = document.querySelector(selector);
          if (container) {
            const card = new ItemCard(item).render();
            container.appendChild(card);
          }
        });
    });
  }
}
