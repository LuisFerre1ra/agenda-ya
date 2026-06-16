import { EventType } from '@/types/EventType';
import { eventsStore, lastDeletedEvent, setLastDeletedEvent } from '@/database/mockDb';

export function createEventType(data: Omit<EventType, 'id'>): { success: boolean; event?: EventType; error?: string } {
  throw new Error("Not implemented");
}

export function updateEventType(id: string, data: Partial<EventType>): { success: boolean; event?: EventType; error?: string } {
  throw new Error("Not implemented");
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
  throw new Error("Not implemented");
}

export function filterEventTypesByModality(events: EventType[], modality: string): EventType[] {
  throw new Error("Not implemented");
}

export function sortEventTypesByDuration(events: EventType[], order: 'asc' | 'desc'): EventType[] {
  throw new Error("Not implemented");
}