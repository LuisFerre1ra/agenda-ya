describe('AgendaYA - Módulo 03: Tipos de Evento - Edición de Evento Existente', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/tipos-de-evento');
  });

  it('Debe permitir editar los datos de un tipo de evento existente y reflejar los cambios en la tabla', () => {
    // Arrange: identificar el primer evento en la tabla y abrir el modal de edición
    cy.get('[data-cy="heading-page-title"]').should('be.visible');
    cy.get('[data-cy="event-row"]').first().within(() => {
      cy.get('[data-cy="btn-edit-event"]').click();
    });
    cy.get('[data-cy="modal-event-type"]').should('be.visible');

    // Act: modificar nombre, duración, modalidad y método de confirmación
    cy.get('[data-cy="input-event-name"]').clear().type('Consulta Médica Especializada');
    cy.get('[data-cy="input-event-duration"]').clear().type('45');
    cy.get('[data-cy="radio-modality-presencial"]').check();
    cy.get('[data-cy="radio-confirmation-manual"]').check();
    cy.get('[data-cy="btn-save-event"]').click();

    // Assert: verificar Toast de confirmación y persistencia visible en la grilla
    cy.get('[data-cy="toast-notification"]')
      .should('be.visible')
      .and('contain.text', 'Cambios guardados con éxito');

    cy.get('[data-cy="table-event-types"]').within(() => {
      cy.contains('[data-cy="cell-event-name"]', 'Consulta Médica Especializada').should('be.visible');
      cy.contains('[data-cy="cell-event-modality"]', 'Presencial').should('be.visible');
      cy.contains('[data-cy="cell-event-confirmation"]', 'Manual').should('be.visible');
    });
  });
});
