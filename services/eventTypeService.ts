import { EventType } from '@/types/EventType';
import { eventsStore, lastDeletedEvent, setLastDeletedEvent } from '@/database/mockDb';

export function createEventType(data: Omit<EventType, 'id'>): { success: boolean; event?: EventType; error?: string } {
  throw new Error("Not implemented");
}

export function updateEventType(id: string, data: Partial<EventType>): { success: boolean; event?: EventType; error?: string } {
  const index = eventsStore.findIndex(event => event.id === id);
  if (index === -1) {
    return { success: false, error: "El ID ingresado no existe." };
  }

  if (data.name !== undefined) {
    if (data.name.trim() === '') {
      return { success: false, error: "El nombre no puede estar vacío." };
    }
  }

  const updatedEvent = { ...eventsStore[index], ...data };
  eventsStore[index] = updatedEvent;

  return { success: true, event: updatedEvent };
}

export function deleteEventType(id: string): { success: boolean; error?: string } {
  const index = eventsStore.findIndex(event => event.id === id);
  
  if (index === -1) {
    // Si no encuentra el ID, retorna falso y el mensaje de error
    return { success: false, error: "El ID ingresado no existe." };
  }

  // Elimina el evento del array y lo guarda en la "papelera"
  const [deletedEvent] = eventsStore.splice(index, 1);
  setLastDeletedEvent(deletedEvent);

  return { success: true };
}

export function restoreEventType(): { success: boolean; event?: EventType; error?: string } {
  if (!lastDeletedEvent) {
    return { success: false, error: "No hay eventos eliminados recientemente para deshacer." };
  }

  // Si hay un evento en la papelera, lo regresa a la lista activa
  eventsStore.push(lastDeletedEvent);
  const restored = lastDeletedEvent;
  
  // Limpia la papelera
  setLastDeletedEvent(null);

  return { success: true, event: restored };
}

export function filterEventTypesByName(events: EventType[], query: string): EventType[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return events;
  }

  return events.filter(event =>
    event.name.toLowerCase().includes(normalizedQuery)
  );
}

export function filterEventTypesByModality(events: EventType[], modality: EventType['modality']): EventType[] {
  return events.filter(event => event.modality === modality);
}

export function sortEventTypesByDuration(events: EventType[], order: 'asc' | 'desc'): EventType[] {
  return [...events].sort((a, b) => {
    if (order === 'asc') {
      return a.duration - b.duration;
    }

    return b.duration - a.duration;
  });
}