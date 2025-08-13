// Entry point for the itinerary planner

import { Trip } from './models/Trip.js';
import { StorageService } from './services/StorageService.js';
import { TripHeader } from './ui/TripHeader.js';
import { DayColumn } from './ui/DayColumn.js';
import { ItemManager } from './ui/ItemManager.js';

import { ItemCard } from './ui/ItemCard.js';
window.ItemCard = ItemCard;


document.addEventListener('DOMContentLoaded', () => {
  console.log('Planner initialized');

  // Placeholder: initialize trip or load from storage
  const trip = StorageService.loadTrip() || new Trip('My Trip', 'USD', 3);
  StorageService.saveTrip(trip);

  // Render trip header
  const root = document.getElementById('planner-root');
  const header = new TripHeader(trip).render();
  root.appendChild(header);
  // Render day columns
  trip.days.forEach((_, i) => {
    const label = trip.startDate
      ? `Day ${i + 1} (${trip.startDate})`
      : `Day ${i + 1}`;
    const dayCol = new DayColumn(i, label).render();
    root.appendChild(dayCol);
  // Render items into segments
  const itemManager = new ItemManager(trip);
  itemManager.renderAll();
});
});
