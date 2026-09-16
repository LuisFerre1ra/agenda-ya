describe('AgendaYA - Módulo 04: Reserva Pública - Navegación y Retroceso entre Pasos', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('/reserva');
  });

  it('Debe permitir retroceder entre pasos mediante el botón de volver sin perder el flujo', () => {
    // Arrange: avanzar del Paso 1 al Paso 2 seleccionando el primer evento
    cy.get('[data-cy="step1-title"]').should('be.visible');
    cy.get('[data-cy="event-card"]').first().click();
    cy.get('[data-cy="btn-step1-continue"]').click();
    cy.get('[data-cy="step2-title"]').should('be.visible');

    // Act: presionar el botón de retroceso para volver al Paso 1
    cy.get('[data-cy="btn-booking-back"]').click();

    // Assert: verificar que retorna al Paso 1 y permite reelegir otro evento
    cy.get('[data-cy="step1-title"]').should('be.visible');
    cy.get('[data-cy="event-card"]').eq(1).click();
    cy.get('[data-cy="btn-step1-continue"]').click();

    // Act 2: avanzar al Paso 3 y volver a retroceder al Paso 2
    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="calendar-day"][data-cy-status="available"]').first().click();
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().click();
    cy.get('[data-cy="btn-step2-continue"]').click();

    cy.get('[data-cy="step3-title"]').should('be.visible');
    cy.get('[data-cy="btn-booking-back"]').click();

    // Assert 2: verificar retorno exitoso al Paso 2 de fecha y hora
    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="calendar-container"]').should('be.visible');
  });
});
