describe('AgendaYA - Módulo 03: Tipos de Evento - Creación Exitosa de Evento', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/tipos-de-evento');
  });

  it('Debe crear un nuevo tipo de evento correctamente y reflejarlo en la tabla con notificación de éxito', () => {
    // Arrange: abrir el modal de nuevo tipo de evento y verificar que cargue limpio
    cy.get('[data-cy="heading-page-title"]').should('be.visible');
    cy.get('[data-cy="btn-new-event-type"]').click();
    cy.get('[data-cy="modal-event-type"]').should('be.visible');

    // Act: completar el formulario con datos válidos y guardar
    cy.get('[data-cy="input-event-name"]').type('Entrevista Técnica');
    cy.get('[data-cy="input-event-duration"]').clear().type('45');
    cy.get('[data-cy="select-duration-unit"]').select('minutos');
    cy.get('[data-cy="radio-modality-virtual"]').check();
    cy.get('[data-cy="radio-confirmation-automatica"]').check();
    cy.get('[data-cy="textarea-event-description"]').type('Evaluación de competencias técnicas en vivo.');
    cy.get('[data-cy="btn-save-event"]').click();

    // Assert: verificar toast de éxito y presencia del nuevo evento con todos sus datos en la grilla
    cy.get('[data-cy="toast-notification"]')
      .should('be.visible')
      .and('contain.text', 'Tipo de evento creado con éxito');

    // Localizar específicamente la fila del evento recién creado y verificar todas sus columnas
    cy.contains('[data-cy="event-row"]', 'Entrevista Técnica').should('be.visible').within(() => {
      cy.get('[data-cy="cell-event-name"]').should('contain.text', 'Entrevista Técnica');
      cy.get('[data-cy="cell-event-duration"]').should('contain.text', '45 min');
      cy.get('[data-cy="cell-event-modality"]').should('contain.text', 'Virtual');
      cy.get('[data-cy="cell-event-description"]').should('contain.text', 'Evaluación de competencias técnicas en vivo.');
      cy.get('[data-cy="cell-event-confirmation"]').should('contain.text', 'Automática');
    });
  });
});
