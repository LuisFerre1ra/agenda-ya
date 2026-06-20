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

// --- Simulador para el Módulo 4: Calendario y Reservas ---

// Helper para generar un número pseudo-aleatorio determinístico basado en seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Genera time slots de forma determinística basada en la fecha y duración del evento
const generateTimeSlotsWithSeed = (dateString: string, duration: number = 30) => {
  const seed = new Date(dateString).getTime();

  // Base de horas (hasta 8 posibles). Slicearemos para obtener entre 4 y 8 slots.
  const baseHours = [9, 10, 11, 12, 13, 14, 15, 16];

  // Determina de forma determinística cuántos slots habrá ese día: 4..8
  const slotCount = 4 + Math.floor(seededRandom(seed) * 5); // 4..8
  const hours = baseHours.slice(0, slotCount);

  return hours.map((hour, index) => {
    const startHour = String(hour).padStart(2, '0');
    const endHour = String(Math.floor((hour * 60 + duration) / 60)).padStart(2, '0');
    const endMinute = String((hour * 60 + duration) % 60).padStart(2, '0');

    // Usa semillas desplazadas para cada slot y una probabilidad cercana al 50%.
    // Así habrá variabilidad y también posibilidad de que TODOS estén ocupados.
    return {
      id: String(index + 1),
      time: `${startHour}:00 - ${endHour}:${endMinute}`,
      available: seededRandom(seed + 100 + index) > 0.5,
    };
  });
};

export const getAvailabilityForMonth = (year: number, month: number, duration: number = 30) => {
  const fullDays: number[] = [];
  const unavailableDays: number[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Fines de semana SIEMPRE deshabilitados
      unavailableDays.push(i);
    } else {
      // Entre semana: un día está ocupado si TODOS sus time slots están ocupados
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const slots = generateTimeSlotsWithSeed(dateStr, duration);
      const allSlotsOccupied = slots.every(slot => !slot.available);
      if (allSlotsOccupied) {
        fullDays.push(i);
      }
    }
  }

  // Asegurar que haya entre 3 y 6 días "completamente ocupados" por mes.
  // Si la aleatoriedad no produjo suficientes, añadimos días determinísticamente.
  if (fullDays.length < 3) {
    const monthSeed = new Date(year, month - 1, 1).getTime();
    const target = 3 + Math.floor(seededRandom(monthSeed + 9999) * 4); // 3..6
    let candidate = Math.floor(seededRandom(monthSeed + 12345) * daysInMonth) + 1;
    let tries = 0;
    // Recorremos días hasta alcanzar el objetivo o agotarnos.
    while (fullDays.length < target && tries < daysInMonth * 2) {
      const dayOfWeek = new Date(year, month - 1, candidate).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !fullDays.includes(candidate)) {
        fullDays.push(candidate);
      }
      candidate = (candidate % daysInMonth) + 1;
      tries++;
    }
  }

  return { fullDays, unavailableDays };
};

export const getTimeSlotsForDate = (dateString: string, duration: number = 30) => {
  return generateTimeSlotsWithSeed(dateString, duration);
};