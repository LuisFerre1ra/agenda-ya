import { GuestData } from "./GuestData";

export interface Booking {
  eventId: string;
  date: string;
  time: string;
  guest: GuestData;
  status: 'Pendiente' | 'Confirmada';
}