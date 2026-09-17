describe('AgendaYA - Módulo 03: Tipos de Evento - Edición de Evento Existente', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/tipos-de-evento');
  });

  it('Debe permitir editar los datos de un tipo de evento existente y reflejar los cambios en la tabla manteniendo los campos no modificados', () => {
    // Arrange: capturar el ID y datos originales de la primera fila para validar su persistencia
    cy.get('[data-cy="heading-page-title"]').should('be.visible');
    cy.get('[data-cy="event-row"]').first().as('targetRow');

    cy.get('@targetRow').invoke('attr', 'data-cy-event-id').as('targetId');
    cy.get('@targetRow').find('[data-cy="cell-event-description"]').invoke('text').as('originalDescription');

    cy.get('@targetRow').within(() => {
      cy.get('[data-cy="btn-edit-event"]').click();
    });
    cy.get('[data-cy="modal-event-type"]').should('be.visible');

    // Act: modificar nombre, duración, modalidad y método de confirmación (dejando descripción intacta)
    cy.get('[data-cy="input-event-name"]').clear().type('Consulta Médica Especializada');
    cy.get('[data-cy="input-event-duration"]').clear().type('45');
    cy.get('[data-cy="radio-modality-presencial"]').check();
    cy.get('[data-cy="radio-confirmation-manual"]').check();
    cy.get('[data-cy="btn-save-event"]').click();

    // Assert: verificar Toast de confirmación
    cy.get('[data-cy="toast-notification"]')
      .should('be.visible')
      .and('contain.text', 'Cambios guardados con éxito');

    // Verificar específicamente sobre la fila que tenía ese mismo ID que los campos editados cambiaron
    // y que los campos no editados (descripción) permanecen inalterados
    cy.get('@targetId').then((id) => {
      cy.get(`[data-cy="event-row"][data-cy-event-id="${id}"]`).within(() => {
        cy.get('[data-cy="cell-event-name"]').should('contain.text', 'Consulta Médica Especializada');
        cy.get('[data-cy="cell-event-duration"]').should('contain.text', '45 min');
        cy.get('[data-cy="cell-event-modality"]').should('contain.text', 'Presencial');
        cy.get('[data-cy="cell-event-confirmation"]').should('contain.text', 'Manual');

        cy.get('@originalDescription').then((origDesc) => {
          cy.get('[data-cy="cell-event-description"]').should('contain.text', (origDesc as unknown as string).trim());
        });
      });
    });
  });
});
