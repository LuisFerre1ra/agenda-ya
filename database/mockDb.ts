import { EventType } from '@/types/EventType';
import { Booking } from '@/types/Booking';

const seedEvents: EventType[] = [
  {
    id: "1",
    name: "Consulta Inicial",
    duration: 30,
    modality: "Virtual",
    description: "Breve reunión para conocer necesidades.",
    confirmation: 'Automática'
  },
  {
    id: "2",
    name: "Reunión de Seguimiento",
    duration: 60,
    modality: "Presencial",
    description: "Revisión de progreso y próximos pasos",
    confirmation: 'Manual'
  },
  {
    id: "3",
    name: "Taller Grupal",
    duration: 120,
    modality: "Presencial",
    description: "Sesión interactiva sobre temas específicos",
    confirmation: 'Automática'
  }
];

// --- Tablas Simuladas ---
export let eventsStore: EventType[] = [...seedEvents];
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