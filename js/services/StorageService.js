import { Trip } from '../models/Trip.js';

export class StorageService {
  static saveTrip(trip) {
    const data = trip.toJSON();
    localStorage.setItem('currentTrip', JSON.stringify(data));
  }

  static loadTrip() {
    const data = localStorage.getItem('currentTrip');
    if (data) {
      try {
        return Trip.fromJSON(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse trip data:', e);
      }
    }
    return null;
  }
}
