export class ItemCard {
  constructor(item) {
    this.item = item;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.itemId = this.item.id;

    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = this.item.title;

    const time = document.createElement('div');
    time.className = 'item-time';
    time.textContent = this.item.startTime
      ? `${this.item.startTime} (${this.item.durationMinutes} min)`
      : `${this.item.durationMinutes} min`;

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.textContent = '≡';
    handle.draggable = true;

    const cost = document.createElement('div');
    cost.className = 'item-cost';
    cost.textContent = this.item.cost != null ? `$${this.item.cost}` : '—';

    card.appendChild(handle);
    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(cost);

    return card;
  }
}
