import * as EventService from '@/services/eventTypeService';
import * as DB from '@/database/mockDb';
import { EventType } from '@/types/EventType';

describe('Módulo 03 - Tipos de Evento', () => {

  describe('Creación de tipos de evento', () => {
    beforeEach(() => {
      // Limpiar la db antes de testear creación para no tener basura
      DB.resetEventsStore([]);
    });

    test('Validar retorno exitoso al enviar campos obligatorios', () => {
      const data = {
        name: 'Consulta Nueva',
        duration: 30,
        modality: 'Virtual' as const,
        confirmation: 'Automática' as const
      };
      
      const result = EventService.createEventType(data);
      
      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.name).toBe('Consulta Nueva');
      expect(result.event?.id).toBeDefined();
      
      expect(DB.eventsStore.length).toBe(1);
      expect(DB.eventsStore[0].name).toBe('Consulta Nueva');
    });

    test('Rechazar creación si el nombre está vacío', () => {
      const data = {
        name: '   ',
        duration: 30,
        modality: 'Presencial' as const,
        confirmation: 'Manual' as const
      };
      
      const result = EventService.createEventType(data);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('El nombre no puede estar vacío.');
      expect(DB.eventsStore.length).toBe(0);
    });

    test('Rechazar duraciones ilógicas (0 o negativas)', () => {
      const data = {
        name: 'Consulta Rápida',
        duration: -10,
        modality: 'Virtual' as const,
        confirmation: 'Automática' as const
      };
      
      const result = EventService.createEventType(data);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('La duración debe ser mayor a 0.');
      expect(DB.eventsStore.length).toBe(0);
    });

    test('Crear evento con duración mínima admisible (1 minuto)', () => {
      const data = {
        name: 'Consulta Express',
        duration: 1,
        modality: 'Virtual' as const,
        confirmation: 'Automática' as const
      };

      const result = EventService.createEventType(data);

      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.duration).toBe(1);
      expect(DB.eventsStore[0].duration).toBe(1);
    });

    test('Rechazar creación si el nombre contiene solo tabulaciones y saltos de línea', () => {
      const data = {
        name: '\t \n  ',
        duration: 30,
        modality: 'Presencial' as const,
        confirmation: 'Manual' as const
      };

      const result = EventService.createEventType(data);

      expect(result.success).toBe(false);
      expect(result.error).toBe('El nombre no puede estar vacío.');
      expect(DB.eventsStore.length).toBe(0);
    });
  });

  describe('Edición de tipos de evento', () => {
    const mockEvents: EventType[] = [
      { id: '1', name: 'Consulta Inicial', duration: 30, modality: 'Virtual', confirmation: 'Automática', description: '' },
      { id: '2', name: 'Reunión de Seguimiento', duration: 60, modality: 'Presencial', confirmation: 'Manual', description: '' }
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

    test('Rechazar actualización si el ID no existe en el store', () => {
      const result = EventService.updateEventType('9999', { name: 'Inexistente' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('El ID ingresado no existe.');
    });

    test('Actualizar parcialmente la descripción sin modificar nombre, duración ni modalidad', () => {
      const result = EventService.updateEventType('1', { description: 'Nueva descripción detallada' });

      expect(result.success).toBe(true);
      expect(result.event?.description).toBe('Nueva descripción detallada');
      expect(result.event?.name).toBe('Consulta Inicial');
      expect(result.event?.duration).toBe(30);
      expect(result.event?.modality).toBe('Virtual');
    });

    test('Preservar la descripción existente al editar solo la duración o confirmación (INC-0305)', () => {
      DB.resetEventsStore([
        {
          id: '1',
          name: 'Consulta Inicial',
          duration: 30,
          modality: 'Virtual',
          confirmation: 'Automática',
          description: 'Breve reunión para conocer necesidades del cliente.'
        }
      ]);

      const result = EventService.updateEventType('1', { duration: 45 });

      expect(result.success).toBe(true);
      expect(result.event?.description).toBe('Breve reunión para conocer necesidades del cliente.');
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

    test('Manejar error al intentar restaurar cuando la papelera está vacía', () => {
      // Aseguramos papelera limpia
      DB.setLastDeletedEvent(null);

      const restoreResult = EventService.restoreEventType();

      expect(restoreResult.success).toBe(false);
      expect(restoreResult.error).toBe('No hay eventos eliminados recientemente para deshacer.');
    });

    test('Rechazar una segunda llamada consecutiva a deshacer por papelera ya vaciada', () => {
      // Eliminamos el evento '1'
      EventService.deleteEventType('1');

      // Primer deshacer: exitoso
      const firstRestore = EventService.restoreEventType();
      expect(firstRestore.success).toBe(true);
      expect(firstRestore.event?.id).toBe('1');

      // Segundo deshacer consecutivo: debe fallar
      const secondRestore = EventService.restoreEventType();
      expect(secondRestore.success).toBe(false);
      expect(secondRestore.error).toBe('No hay eventos eliminados recientemente para deshacer.');
    });
  });

describe('Visualización y Filtros', () => {
  const mockEvents: EventType[] = [
    { id: '1', name: 'Consulta Inicial', duration: 30, modality: 'Virtual', confirmation: 'Automática' },
    { id: '2', name: 'Consulta Nutricional', duration: 45, modality: 'Presencial', confirmation: 'Manual' },
    { id: '3', name: 'Reunión de Seguimiento', duration: 60, modality: 'Virtual', confirmation: 'Manual' },
    { id: '4', name: 'Clase de Yoga', duration: 90, modality: 'Presencial', confirmation: 'Automática' }
  ];

  test('Filtrar eventos por coincidencia de nombre', () => {
    const result = EventService.filterEventTypesByName(mockEvents, 'consulta');

    expect(result).toHaveLength(2);
    expect(result.map(event => event.name)).toEqual([
      'Consulta Inicial',
      'Consulta Nutricional'
    ]);
  });

  test('Ordenar eventos por duración (asc/desc)', () => {
    const ascendingResult = EventService.sortEventTypesByDuration(mockEvents, 'asc');
    const descendingResult = EventService.sortEventTypesByDuration(mockEvents, 'desc');

    expect(ascendingResult.map(event => event.duration)).toEqual([30, 45, 60, 90]);
    expect(descendingResult.map(event => event.duration)).toEqual([90, 60, 45, 30]);
  });

  test('Filtrar eventos correctamente por modalidad', () => {
    const result = EventService.filterEventTypesByModality(mockEvents, 'Virtual');

    expect(result).toHaveLength(2);
    expect(result.every(event => event.modality === 'Virtual')).toBe(true);
    expect(result.map(event => event.name)).toEqual([
      'Consulta Inicial',
      'Reunión de Seguimiento'
    ]);
  });

  test('Retornar todos los eventos si el término de búsqueda está vacío o contiene solo espacios', () => {
    const emptyResult = EventService.filterEventTypesByName(mockEvents, '');
    const spacesResult = EventService.filterEventTypesByName(mockEvents, '   ');

    expect(emptyResult).toHaveLength(mockEvents.length);
    expect(spacesResult).toHaveLength(mockEvents.length);
  });

  test('Retornar un array vacío si no hay coincidencias con el término de búsqueda', () => {
    const result = EventService.filterEventTypesByName(mockEvents, 'termino-sin-coincidencia-xyz');

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});

  describe('Ordenamiento Algorítmico y Filtrado por Modalidad', () => {
    const unsortedEvents: EventType[] = [
      { id: '1', name: 'Sesión Larga', duration: 120, modality: 'Presencial', confirmation: 'Automática' },
      { id: '2', name: 'Reunión Breve', duration: 15, modality: 'Virtual', confirmation: 'Manual' },
      { id: '3', name: 'Taller Estándar', duration: 60, modality: 'Presencial', confirmation: 'Automática' },
      { id: '4', name: 'Consulta Corta', duration: 30, modality: 'Virtual', confirmation: 'Manual' }
    ];

    test('Ordenar eventos en sentido ascendente estricto por duración', () => {
      const result = EventService.sortEventTypesByDuration(unsortedEvents, 'asc');

      expect(result.map(e => e.duration)).toEqual([15, 30, 60, 120]);
    });

    test('Preservar estabilidad ante eventos con duraciones idénticas', () => {
      const duplicateDurationEvents: EventType[] = [
        { id: '1', name: 'A', duration: 30, modality: 'Virtual', confirmation: 'Automática' },
        { id: '2', name: 'B', duration: 60, modality: 'Presencial', confirmation: 'Manual' },
        { id: '3', name: 'C', duration: 30, modality: 'Virtual', confirmation: 'Manual' },
        { id: '4', name: 'D', duration: 60, modality: 'Presencial', confirmation: 'Automática' }
      ];

      const result = EventService.sortEventTypesByDuration(duplicateDurationEvents, 'asc');

      expect(result).toHaveLength(4);
      expect(result.map(e => e.duration)).toEqual([30, 30, 60, 60]);
    });

    test('Retornar array vacío al ordenar una colección vacía sin errores', () => {
      const ascResult = EventService.sortEventTypesByDuration([], 'asc');
      const descResult = EventService.sortEventTypesByDuration([], 'desc');

      expect(ascResult).toEqual([]);
      expect(descResult).toEqual([]);
    });

    test('Filtrar eventos exclusivamente por modalidad Presencial', () => {
      const result = EventService.filterEventTypesByModality(unsortedEvents, 'Presencial');

      expect(result).toHaveLength(2);
      expect(result.every(e => e.modality === 'Presencial')).toBe(true);
      expect(result.map(e => e.name)).toEqual(['Sesión Larga', 'Taller Estándar']);
    });

    test('Retornar array vacío si no existen eventos de la modalidad solicitada', () => {
      const onlyVirtualEvents: EventType[] = [
        { id: '1', name: 'Virtual 1', duration: 30, modality: 'Virtual', confirmation: 'Automática' },
        { id: '2', name: 'Virtual 2', duration: 45, modality: 'Virtual', confirmation: 'Manual' }
      ];

      const result = EventService.filterEventTypesByModality(onlyVirtualEvents, 'Presencial');

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});