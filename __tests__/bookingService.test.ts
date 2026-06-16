import * as BookingService from '@/services/bookingService';

describe('Módulo 04 - Proceso de Reserva', () => {

  describe('Selección de fecha y hora', () => {
    test('Devolver lista correcta de horarios disponibles', () => { /* TODO */ });
    test('Impedir selección de fechas en el pasado', () => { /* TODO */ });
    test('Excluir horarios ya ocupados de la disponibilidad', () => { /* TODO */ });
  });

  describe('Ingreso de datos del invitado', () => {
    test('Aprobar si solo se envían datos obligatorios', () => { /* TODO */ });
    test('Rechazar formato de email inválido', () => { /* TODO */ });
    test('Procesar correctamente si se envían datos opcionales', () => { /* TODO */ });
  });

  describe('Confirmación de la reserva', () => {
    test('Generar resumen exacto con datos de cita e invitado', () => { /* TODO */ });
    test('Cambiar estado del horario a ocupado tras confirmación', () => { /* TODO */ });
    test('Arrojar error de concurrencia si el turno ya fue ocupado', () => { /* TODO */ });
  });

});