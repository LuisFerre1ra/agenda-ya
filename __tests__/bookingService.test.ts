import * as BookingService from '@/services/bookingService';

describe('Módulo 04 - Proceso de Reserva', () => {

  describe('Selección de fecha y hora', () => {
    test('Devolver lista correcta de horarios disponibles', () => { /* TODO */ });
    test('Impedir selección de fechas en el pasado', () => { /* TODO */ });
    test('Excluir horarios ya ocupados de la disponibilidad', () => { /* TODO */ });
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
    test('Generar resumen exacto con datos de cita e invitado', () => { /* TODO */ });
    test('Cambiar estado del horario a ocupado tras confirmación', () => { /* TODO */ });
    test('Arrojar error de concurrencia si el turno ya fue ocupado', () => { /* TODO */ });
  });

});