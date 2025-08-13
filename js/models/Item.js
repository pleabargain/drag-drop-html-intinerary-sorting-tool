import { IdGenerator } from '../utils/IdGenerator.js';

export class Item {
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
    this.description = '';
    this.mapUrl = '';
    this.contactNumber = '';
    this.notes = '';
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      dayIndex: this.dayIndex,
      segment: this.segment,
      durationMinutes: this.durationMinutes,
      status: this.status,
      startTime: this.startTime,
      cost: this.cost,
      description: this.description,
      mapUrl: this.mapUrl,
      contactNumber: this.contactNumber,
      notes: this.notes
    };
  }
}
