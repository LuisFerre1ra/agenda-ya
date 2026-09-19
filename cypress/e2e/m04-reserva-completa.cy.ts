describe('AgendaYA - Módulo 04: Reserva Pública - Flujo Completo de Reserva', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('/reserva');
  });

  it('Debe completar exitosamente los 4 pasos del proceso de reserva y verificar la coincidencia de todos los datos en el resumen', () => {
    // Arrange: iniciar flujo en la vista mobile y verificar el primer paso
    cy.get('[data-cy="step1-title"]').should('be.visible');

    // Act 1: capturar nombre de la tarjeta del evento seleccionado y avanzar
    cy.get('[data-cy="event-card-name"]').first().invoke('text').then((name) => {
      cy.wrap(name.trim()).as('chosenEventName');
    });
    cy.get('[data-cy="event-card"]').first().click();
    cy.get('[data-cy="btn-step1-continue"]').click();

    // Act 2: seleccionar día y capturar horario disponible
    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="calendar-day"][data-cy-status="available"]').first().click();
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().invoke('text').then((time) => {
      cy.wrap(time.trim()).as('chosenTimeSlot');
    });
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().click();
    cy.get('[data-cy="btn-step2-continue"]').click();

    // Act 3: ingresar datos completos del invitado
    cy.get('[data-cy="step3-title"]').should('be.visible');
    cy.get('[data-cy="input-guest-name"]').type('Mateo Marchesi');
    cy.get('[data-cy="input-guest-email"]').type('marchesimateo967@gmail.com');
    cy.get('[data-cy="input-guest-phone"]').type('1133445566');
    cy.get('[data-cy="textarea-guest-notes"]').type('Turno para consulta presencial de evaluación.');
    cy.get('[data-cy="btn-step3-continue"]').click();

    // Act 4: verificar exhaustivamente todos los campos del resumen en el Paso 4
    cy.get('[data-cy="step4-title"]').should('be.visible');

    cy.get('@chosenEventName').then((eventName) => {
      cy.get('[data-cy="summary-event-name"]').should('contain.text', eventName as unknown as string);
    });

    cy.get('@chosenTimeSlot').then((timeSlot) => {
      cy.get('[data-cy="summary-event-time"]').should('contain.text', timeSlot as unknown as string);
    });

    cy.get('[data-cy="summary-guest-name"]').should('contain.text', 'Mateo Marchesi');
    cy.get('[data-cy="summary-guest-email"]').should('contain.text', 'marchesimateo967@gmail.com');
    cy.get('[data-cy="summary-guest-phone"]').should('contain.text', '1133445566');
    cy.get('[data-cy="summary-guest-note"]').should('contain.text', 'Turno para consulta presencial de evaluación.');

    // Confirmar reserva
    cy.get('[data-cy="btn-confirm-booking"]').click();

    // Assert: verificar despliegue de la pantalla de éxito con los mensajes correspondientes
    cy.get('[data-cy="booking-success-screen"]', { timeout: 6000 }).should('be.visible');
    cy.get('[data-cy="booking-success-title"]').should('contain.text', 'Reserva Confirmada');
    cy.get('[data-cy="booking-success-message"]').should('contain.text', 'Tu cita ha sido agendada con éxito');
  });
});
