import { Booking } from '@/types/Booking';
import { EventType } from '@/types/EventType';
import { GuestData } from '@/types/GuestData';

export type BookingSummary = {
  event: EventType;
  booking: Booking;
};

export function getAvailableSlots(date: Date, allSlots: string[], occupiedSlots: string[]): string[] {
  if (!date || !Array.isArray(allSlots)) return [];

  // Compare only the date part (ignore time) to determine if it's in the past
  const given = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (given < todayOnly) return [];

  const occupiedSet = new Set(occupiedSlots || []);
  return allSlots.filter((slot) => !occupiedSet.has(slot));
}

export function validateGuestData(data: GuestData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    errors.push('No data provided');
    return { isValid: false, errors };
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    // simple email regex (sufficient for tests)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Email format is invalid');
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function generateBookingSummary(event: EventType, date: string, time: string, guest: GuestData): BookingSummary {
  const booking: Booking = {
    eventId: event.id,
    date,
    time,
    guest,
    status: 'Pendiente',
  };

  return {
    event: { ...event },
    booking,
  };
}

export function confirmBooking(booking: Booking, availableSlots: string[]): { success: boolean; booking?: Booking; error?: string } {
  if (!availableSlots.includes(booking.time)) {
    return { success: false, error: 'Slot is no longer available'};
  }
  const index = availableSlots.indexOf(booking.time);
  availableSlots.splice(index, 1);
  return {success: true, booking: {...booking, status: 'Confirmada'}
  };
}

// Helper to process guest form: validates and returns processed guest object if valid
export function processGuestForm(payload: Partial<GuestData>): { success: boolean; guest?: GuestData; errors?: string[] } {
  const guest: GuestData = {
    name: payload.name ?? '',
    email: payload.email ?? '',
    phone: payload.phone,
    note: payload.note,
  };

  const validation = validateGuestData(guest);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  return { success: true, guest };
}