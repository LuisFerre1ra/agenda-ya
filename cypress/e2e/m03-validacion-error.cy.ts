describe('AgendaYA - Módulo 03: Tipos de Evento - Validación de Formulario', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/tipos-de-evento');
  });

  it('Debe mostrar error visible y deshabilitar el botón de guardado cuando el nombre está vacío', () => {
    // Arrange: preparar el estado inicial y abrir el modal de creación
    cy.get('[data-cy="heading-page-title"]').should('be.visible');
    cy.get('[data-cy="btn-new-event-type"]').click();
    cy.get('[data-cy="modal-event-type"]').should('be.visible');

    // Act: ejecutar la acción principal ingresando solo espacios y desenfocando el campo
    cy.get('[data-cy="input-event-name"]').type('   ').blur();

    // Assert: verificar el resultado esperado (mensaje de error y botón deshabilitado)
    cy.get('[data-cy="error-event-name"]')
      .should('be.visible')
      .and('contain.text', 'El campo no puede estar vacío.');
    cy.get('[data-cy="btn-save-event"]').should('be.disabled');
  });
});
