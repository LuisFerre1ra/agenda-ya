import * as BookingService from '@/services/bookingService';

describe('Módulo 04 - Proceso de Reserva', () => {

  describe('Selección de fecha y hora', () => {
    test('Devolver lista correcta de horarios disponibles', () => {
      const allSlots = ['09:00', '09:30', '10:00', '10:30'];
      const occupied = ['09:30', '10:30'];
      const today = new Date();

      const available = BookingService.getAvailableSlots(today, allSlots, occupied);

      expect(available).toEqual(['09:00', '10:00']);
    });

    test('Impedir selección de fechas en el pasado', () => {
      const allSlots = ['09:00', '09:30', '10:00'];
      const occupied: string[] = [];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const available = BookingService.getAvailableSlots(yesterday, allSlots, occupied);

      // For dates in the past, no slots should be returned
      expect(available).toEqual([]);
    });

    test('Excluir horarios ya ocupados de la disponibilidad', () => {
      const allSlots = ['08:00', '08:30', '09:00'];
      const occupied = ['08:30'];
      const someDate = new Date();

      const available = BookingService.getAvailableSlots(someDate, allSlots, occupied);

      // occupied slots must not appear in the available list
      expect(available).not.toContain('08:30');
      expect(available).toEqual(['08:00', '09:00']);
    });
  });

  describe('Ingreso de datos del invitado', () => {
    test('Aprobar si solo se envían datos obligatorios', () => {
      const payload = { name: 'Juan Perez', email: 'juan.perez@example.com' };
      const result = BookingService.processGuestForm(payload);
      expect(result.success).toBe(true);
      expect(result.guest).toBeDefined();
      expect(result.guest?.name).toBe(payload.name);
      expect(result.guest?.email).toBe(payload.email);
      expect(result.errors).toBeUndefined();
    });

    test('Rechazar formato de email inválido', () => {
      const payload = { name: 'Maria', email: 'maria-at-example.com' };
      const result = BookingService.processGuestForm(payload);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toContain('Email format is invalid');
    });

    test('Procesar correctamente si se envían datos opcionales', () => {
      const payload = {
        name: 'Ana Gomez',
        email: 'ana.gomez@example.com',
        phone: '+541112345678',
        note: 'Llega tarde'
      };
      const result = BookingService.processGuestForm(payload);
      expect(result.success).toBe(true);
      expect(result.guest).toBeDefined();
      expect(result.guest?.phone).toBe(payload.phone);
      expect(result.guest?.note).toBe(payload.note);
    });
  });

  describe('Confirmación de la reserva', () => {
    test('Generar resumen exacto con datos de cita e invitado', () => {
      const event = {id: '1', name: 'Consulta', duration: 60, modality: 'Presencial', confirmation: 'Automática'} as const;
      const guest = { name: 'Juan Perez', email: 'juan@example.com'};
      const result = BookingService.generateBookingSummary( event,'2026-06-20','09:00', guest);
      expect(result.booking).toEqual({ eventId: '1', date: '2026-06-20', time: '09:00', guest, status: 'Pendiente'});
    });

    test('Cambiar estado del horario a ocupado tras confirmación', () => {
      const availableSlots = ['09:00', '10:00'];
      const booking = {eventId: '1', date: '2026-06-20', time: '09:00', guest: { name: 'Juan Perez', email: 'juan@example.com'}, status: 'Pendiente'} as const;
      const result = BookingService.confirmBooking(booking, availableSlots);
      expect(result.success).toBe(true);
      expect(result.booking?.status).toBe('Confirmada');
      expect(availableSlots).not.toContain('09:00');
      expect(availableSlots).toEqual(['10:00']);
    });


    test('Arrojar error de concurrencia si el turno ya fue ocupado', () => {
      const availableSlots = ['10:00'];
      const booking = {eventId: '1', date: '2026-06-20',time: '09:00', guest: {name: 'Juan Perez', email: 'juan@example.com'}, status: 'Pendiente'} as const;
      const result = BookingService.confirmBooking(booking, availableSlots);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Slot is no longer available');
    });

});

});