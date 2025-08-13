import { IdGenerator } from '../utils/IdGenerator.js';

export class Trip {
  constructor(name, currency, days = 1) {
    this.name = name;
    this.currency = currency || this.getSystemCurrency();
    this.segmentBoundaries = {
      morning: ['08:00', '12:00'],
      afternoon: ['12:00', '17:00'],
      evening: ['17:00', '22:00']
    };
    this.categories = this.getDefaultCategories();
    this.days = this.initializeDays(days);
    this.startDate = null;
    this.timezone = this.getSystemTimezone();
  }

  getSystemCurrency() {
    return Intl.NumberFormat().resolvedOptions().currency || 'USD';
  }

  getSystemTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  getDefaultCategories() {
    return [
      { key: 'activity', name: 'Activity', color: '#3498db', icon: '🎯' },
      { key: 'meal', name: 'Meal', color: '#e67e22', icon: '🍽️' },
      { key: 'transport', name: 'Transport', color: '#2ecc71', icon: '🚗' },
      { key: 'overnight', name: 'Overnight', color: '#9b59b6', icon: '🛏️' },
      { key: 'other', name: 'Other', color: '#95a5a6', icon: '📌' }
    ];
  }

  initializeDays(n) {
    return Array.from({ length: n }, (_, i) => ({
      date: null,
      items: []
    }));
  }

  toJSON() {
    return {
      name: this.name,
      currency: this.currency,
      segmentBoundaries: this.segmentBoundaries,
      categories: this.categories,
      days: this.days,
      startDate: this.startDate,
      timezone: this.timezone
    };
  }

  static fromJSON(data) {
    const trip = new Trip(data.name, data.currency, data.days.length);
    trip.segmentBoundaries = data.segmentBoundaries;
    trip.categories = data.categories;
    trip.days = data.days;
    trip.startDate = data.startDate;
    trip.timezone = data.timezone;
    return trip;
  }
}
