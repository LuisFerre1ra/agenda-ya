import * as EventService from '@/services/eventTypeService';
import * as DB from '@/database/mockDb';
import { EventType } from '@/types/EventType';

describe('Módulo 03 - Tipos de Evento', () => {

  describe('Creación de tipos de evento', () => {
    test('Validar retorno exitoso al enviar campos obligatorios', () => { /* TODO */ });
    test('Rechazar creación si el nombre está vacío', () => { /* TODO */ });
    test('Rechazar duraciones ilógicas (0 o negativas)', () => { /* TODO */ });
  });

  describe('Edición de tipos de evento', () => {
    const mockEvents: EventType[] = [
      { id: '1', name: 'Consulta Inicial', duration: 30, modality: 'Virtual', confirmation: 'Automática' },
      { id: '2', name: 'Reunión de Seguimiento', duration: 60, modality: 'Presencial', confirmation: 'Manual' }
    ];

    beforeEach(() => {
      DB.resetEventsStore(mockEvents);
    });

    test('Actualizar correctamente los atributos modificados', () => {
      const result = EventService.updateEventType('1', { duration: 45, confirmation: 'Manual' });
      expect(result.success).toBe(true);
      expect(result.event?.duration).toBe(45);
      expect(result.event?.confirmation).toBe('Manual');
      
      const eventInDb = DB.eventsStore.find(e => e.id === '1');
      expect(eventInDb?.duration).toBe(45);
    });

    test('Rechazar actualización si se vacía el nombre', () => {
      const result = EventService.updateEventType('2', { name: '   ' });
      expect(result.success).toBe(false);
      expect(result.error).toBe("El nombre no puede estar vacío.");
      
      const eventInDb = DB.eventsStore.find(e => e.id === '2');
      expect(eventInDb?.name).toBe('Reunión de Seguimiento'); // el nombre no cambió
    });

    test('Mantener datos originales al cancelar edición', () => {
      const originalEvent = { ...DB.eventsStore.find(e => e.id === '1')! };
      
      const result = EventService.updateEventType('1', {});
      expect(result.success).toBe(true);
      
      const currentEvent = DB.eventsStore.find(e => e.id === '1');
      expect(currentEvent).toEqual(originalEvent);
    });
  });

  describe('Eliminación de tipos de evento', () => {
    // Datos de prueba (Dummy data)
    const mockEvents: EventType[] = [
      { id: '1', name: 'Consulta Inicial', duration: 30, modality: 'Virtual', confirmation: 'Automática' },
      { id: '2', name: 'Reunión de Seguimiento', duration: 60, modality: 'Presencial', confirmation: 'Manual' }
    ];

    // Antes de cada test, reiniciamos la base de datos con nuestros datos de prueba
    beforeEach(() => {
      DB.resetEventsStore(mockEvents);
    });

    test('Eliminar evento de la lista activa', () => {
      // Ejecutamos la función de borrado
      const result = EventService.deleteEventType('1');

      // Verificamos que la operación fue exitosa
      expect(result.success).toBe(true);

      // Verificamos que el evento con ID '1' ya no esté en la base de datos
      const eventExists = DB.eventsStore.find(e => e.id === '1');
      expect(eventExists).toBeUndefined();

      // Verificamos que la longitud del array haya disminuido
      expect(DB.eventsStore.length).toBe(1);
    });

    test('Deshacer eliminación exitosamente', () => {
      // Primero eliminamos el evento
      EventService.deleteEventType('2');

      // Luego ejecutamos la función para deshacer
      const restoreResult = EventService.restoreEventType();

      // Verificamos que la restauración fue exitosa
      expect(restoreResult.success).toBe(true);
      expect(restoreResult.event?.id).toBe('2');

      // Verificamos que el evento haya vuelto a la base de datos
      const eventExists = DB.eventsStore.find(e => e.id === '2');
      expect(eventExists).toBeDefined();

      // Verificamos que el array vuelva a tener 2 elementos
      expect(DB.eventsStore.length).toBe(2);
    });

    test('Manejar error al intentar eliminar ID inexistente', () => {
      // Intentamos borrar un ID que no creamos ('999')
      const result = EventService.deleteEventType('999');

      // Verificamos que falle y devuelva el error esperado
      expect(result.success).toBe(false);
      expect(result.error).toBe("El ID ingresado no existe.");

      // Verificamos que no se haya borrado nada por accidente
      expect(DB.eventsStore.length).toBe(2);
    });
  });

  describe('Visualización y Filtros', () => {
    test('Filtrar eventos por coincidencia de nombre', () => { /* TODO */ });
    test('Ordenar eventos por duración (asc/desc)', () => { /* TODO */ });
    test('Filtrar eventos correctamente por modalidad', () => { /* TODO */ });
  });

});