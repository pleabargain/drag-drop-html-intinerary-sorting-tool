// Entry point for the itinerary planner

import { Trip } from './models/Trip.js';
import { StorageService } from './services/StorageService.js';
import { TripHeader } from './ui/TripHeader.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Planner initialized');

  // Placeholder: initialize trip or load from storage
  const trip = StorageService.loadTrip() || new Trip('My Trip', 'USD', 3);
  StorageService.saveTrip(trip);

  // Render trip header
  const root = document.getElementById('planner-root');
  const header = new TripHeader(trip).render();
  root.appendChild(header);
});
