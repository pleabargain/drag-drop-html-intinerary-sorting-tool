import { ItemCard } from './ItemCard.js';

export class ItemManager {
  constructor(trip) {
    this.trip = trip;
  }

  renderAll() {
    // Ensure items are in the correct day array
    const reassigned = [];
    this.trip.days.forEach((day, dayIndex) => {
      const correctItems = [];
      day.items.forEach(item => {
        if (item.dayIndex === dayIndex) {
          correctItems.push(item);
        } else {
          reassigned.push(item);
        }
      });
      day.items = correctItems;
    });
    reassigned.forEach(item => {
      if (this.trip.days[item.dayIndex]) {
        this.trip.days[item.dayIndex].items.push(item);
      }
    });

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
