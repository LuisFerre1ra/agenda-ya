describe('AgendaYA - Módulo 04: Reserva Pública - Selección de Fechas y Franjas Horarias', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit('/reserva');
  });

  it('Debe validar controles de calendario, navegación de meses y selección dinámica de horarios', () => {
    // Arrange: seleccionar el primer evento y avanzar al Paso 2
    cy.get('[data-cy="step1-title"]').should('be.visible');
    cy.get('[data-cy="event-card"]').first().click();
    cy.get('[data-cy="btn-step1-continue"]').click();

    // Assert 1: botón continuar inicialmente deshabilitado sin selección
    cy.get('[data-cy="step2-title"]').should('be.visible');
    cy.get('[data-cy="btn-step2-continue"]').should('be.disabled');

    // Act 2: navegación entre meses en el calendario
    cy.get('[data-cy="text-current-month"]').invoke('text').then((initialMonth) => {
      cy.get('[data-cy="btn-next-month"]').click();
      cy.get('[data-cy="text-current-month"]').should('not.have.text', initialMonth);
      cy.get('[data-cy="btn-prev-month"]').click();
      cy.get('[data-cy="text-current-month"]').should('have.text', initialMonth);
    });

    // Act 3: seleccionar día disponible y verificar que se despliegan franjas horarias
    cy.get('[data-cy="calendar-day"][data-cy-status="available"]').first().click();
    cy.get('[data-cy="time-slots-container"]').should('be.visible');
    // Botón continuar sigue deshabilitado hasta seleccionar franja horaria
    cy.get('[data-cy="btn-step2-continue"]').should('be.disabled');

    // Act 4: seleccionar una franja horaria disponible y comprobar habilitación del botón
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').first().click();
    cy.get('[data-cy="btn-step2-continue"]').should('not.be.disabled');

    // Act 5: cambiar a una segunda franja horaria disponible y verificar actualización
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').eq(1).click();
    cy.get('[data-cy="time-slot-btn"][data-cy-available="true"]').eq(1)
      .should('have.class', 'bg-[#2b88d8]')
      .and('have.class', 'text-white');

    // Assert final: avanzar con éxito al Paso 3 con fecha y hora seleccionadas
    cy.get('[data-cy="btn-step2-continue"]').click();
    cy.get('[data-cy="step3-title"]').should('be.visible');
  });
});
