describe('AgendaYA - Módulo 04: Reserva Pública - Validación de Datos del Invitado', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('/reserva');
  });

  it('Debe mostrar errores visibles y no permitir avanzar si el nombre está vacío o el email es inválido', () => {
    // Arrange: avanzar por Paso 1 y Paso 2 hasta llegar al formulario de datos personales (Paso 3)
    cy.get('[data-cy="event-card"]').first().click();
    cy.get('[data-cy="btn-step1-continue"]').click();

    cy.get('[data-cy="calendar-day"][data-cy-status="available"]').first().click();
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().click();
    cy.get('[data-cy="btn-step2-continue"]').click();

    cy.get('[data-cy="step3-title"]').should('be.visible');

    // Act: ingresar email con formato inválido y dejar el nombre vacío con espacios, intentando continuar
    cy.get('[data-cy="input-guest-name"]').type('   ').blur();
    cy.get('[data-cy="input-guest-email"]').type('correo-invalido').blur();
    cy.get('[data-cy="btn-step3-continue"]').click();

    // Assert: verificar los mensajes de error visibles y que no se avance al Paso 4
    cy.get('[data-cy="error-guest-name"]')
      .should('be.visible')
      .and('contain.text', 'El nombre es obligatorio.');
    cy.get('[data-cy="error-guest-email"]')
      .should('be.visible')
      .and('contain.text', 'Ingrese un correo válido.');
    cy.get('[data-cy="step4-title"]').should('not.exist');
    cy.get('[data-cy="step3-title"]').should('be.visible');
  });
});
