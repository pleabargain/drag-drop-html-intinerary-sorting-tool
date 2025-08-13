export class TripHeader {
  constructor(trip) {
    this.trip = trip;
  }

  render() {
    const header = document.createElement('div');
    header.className = 'trip-header';

    const name = document.createElement('h2');
    name.textContent = this.trip.name;

    const currency = document.createElement('span');
    currency.textContent = `Currency: ${this.trip.currency}`;

    header.appendChild(name);
    header.appendChild(currency);
    return header;
  }
}
