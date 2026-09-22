describe('AgendaYA - Módulo 03: Tipos de Evento - Eliminación con Deshacer', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/tipos-de-evento');
  });

  it('Debe permitir eliminar un tipo de evento y restaurarlo inmediatamente con el botón Deshacer', () => {
    // Arrange: asegurar que la tabla tiene elementos y capturar el nombre del primer evento
    cy.get('[data-cy="heading-page-title"]').should('be.visible');
    cy.get('[data-cy="event-row"]').should('have.length.at.least', 1);

    cy.get('[data-cy="cell-event-name"]').first().invoke('text').then((text) => {
      const eventName = text.trim();

      // Act: abrir modal de eliminación y confirmar
      cy.get('[data-cy="btn-delete-event"]').first().click();
      cy.get('[data-cy="modal-delete-event-type"]').should('be.visible');
      cy.get('[data-cy="btn-confirm-delete"]').click();

      // Assert intermedio: verificar que el modal se cierra y que el evento FUE efectivamente eliminado de la tabla
      cy.get('[data-cy="modal-delete-event-type"]').should('not.exist');
      cy.get('[data-cy="table-event-types"]').should('not.contain.text', eventName);

      cy.get('[data-cy="toast-notification"]')
        .should('be.visible')
        .and('contain.text', 'Tipo de evento eliminado.');

      // Act 2: presionar el botón de Deshacer en la notificación
      cy.get('[data-cy="btn-toast-undo"]').click();

      // Assert 2: notificación de confirmación de restauración y evento reincorporado en la tabla
      cy.get('[data-cy="toast-notification"]')
        .should('be.visible')
        .and('contain.text', 'Eliminación deshecha.');

      cy.get('[data-cy="table-event-types"]').should('contain.text', eventName);
    });
  });
});
