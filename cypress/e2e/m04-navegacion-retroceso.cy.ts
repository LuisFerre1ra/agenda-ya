describe('AgendaYA - Módulo 04: Reserva Pública - Navegación y Retroceso entre Pasos', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('/reserva');
  });

  it('Debe permitir retroceder entre todos los pasos mediante el botón de volver sin perder el flujo ni los datos', () => {
    // Arrange: avanzar por todos los pasos hasta llegar al Paso 4 (Resumen)
    cy.get('[data-cy="step1-title"]').should('be.visible');
    cy.get('[data-cy="event-card"]').first().click();
    cy.get('[data-cy="btn-step1-continue"]').click();

    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="calendar-day"][data-cy-status="available"]').first().click();
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().click();
    cy.get('[data-cy="btn-step2-continue"]').click();

    cy.get('[data-cy="step3-title"]').should('be.visible');
    cy.get('[data-cy="input-guest-name"]').type('Nicolás Vega');
    cy.get('[data-cy="input-guest-email"]').type('nicolasvegamalve@gmail.com');
    cy.get('[data-cy="btn-step3-continue"]').click();

    cy.get('[data-cy="step4-title"]').should('be.visible');

    // Act 1: retroceder desde el Paso 4 al Paso 3
    cy.get('[data-cy="btn-booking-back"]').click();

    // Assert 1: verificar que retorna al Paso 3
    cy.get('[data-cy="step3-title"]').should('be.visible');
    cy.get('[data-cy="guest-data-form"]').should('be.visible');

    // Act 2: retroceder desde el Paso 3 al Paso 2
    cy.get('[data-cy="btn-booking-back"]').click();

    // Assert 2: verificar retorno al Paso 2
    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="calendar-container"]').should('be.visible');

    // Act 3: retroceder desde el Paso 2 al Paso 1
    cy.get('[data-cy="btn-booking-back"]').click();

    // Assert 3: verificar retorno al Paso 1 y ausencia de botón volver en paso inicial
    cy.get('[data-cy="step1-title"]').should('be.visible');
    cy.get('[data-cy="btn-booking-back"]').should('not.exist');
  });
});
