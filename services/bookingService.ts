import { Booking } from '@/types/Booking';
import { EventType } from '@/types/EventType';
import { GuestData } from '@/types/GuestData';

export type BookingSummary = {
  event: EventType;
  booking: Booking;
};

export function getAvailableSlots(date: Date, allSlots: string[], occupiedSlots: string[]): string[] {
  throw new Error("Not implemented");
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

export function confirmBooking(requestedSlot: string, availableSlots: string[]): { success: boolean; message?: string; error?: string } {
  if (!availableSlots.includes(requestedSlot)) {
    return { success: false, error: 'Requested slot not available' };
  }
  return { success: true, message: 'Booking confirmed' };
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