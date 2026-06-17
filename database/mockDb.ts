import { EventType } from '@/types/EventType';
import { Booking } from '@/types/Booking';

// --- Tablas Simuladas ---
export let eventsStore: EventType[] = [];
export let bookingsStore: Booking[] = [];

// --- Papeleras (Para deshacer acciones) ---
export let lastDeletedEvent: EventType | null = null;

// --- Funciones de utilidad para aislar los tests ---

// Reinicia la tabla de eventos antes de cada test del Módulo 3
export const resetEventsStore = (initialEvents: EventType[] = []) => {
  eventsStore = [...initialEvents];
  lastDeletedEvent = null;
};

export const setLastDeletedEvent = (event: EventType | null) => {
  lastDeletedEvent = event;
};

// Reinicia la tabla de reservas antes de cada test del Módulo 4
export const resetBookingsStore = (initialBookings: Booking[] = []) => {
  bookingsStore = [...initialBookings];
};