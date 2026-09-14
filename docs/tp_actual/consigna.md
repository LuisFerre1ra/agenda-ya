# Trabajo Práctico Nro. 6: Testing Automatizado

**Cátedra:** Ingeniería de Software – 4to. Año 2026  
**Prof. Adjunta:** Ing. Mónica Colombo  
**Prof. JTP:** Lic. Graciela M. Lastra, Ing. Matías Martínez  
**Ayudante:** Ing. Pablo Iglesias  
**Asignación Grupo 7:** Módulo 03 (*Tipos de Evento*) y Módulo 04 (*Booking Público / Proceso de Reserva*)  

---

## 1. Objetivos

Este trabajo práctico tiene como propósito que los equipos integren los conceptos de **testing automatizado** al ciclo de desarrollo que vienen construyendo sobre AgendaYA. A diferencia de los TPs anteriores, aquí el equipo no solo especifica o diseña: **también construye y verifica**.

Al finalizar el trabajo, cada equipo habrá logrado:
- **Construir un frontend mínimo funcional** que implemente flujos reales del módulo asignado, preparado para ser testeado de forma automatizada.
- **Diseñar y ejecutar tests de punta a punta (E2E) con Cypress** sobre ese frontend, verificando flujos completos desde la perspectiva del usuario.
- **Diseñar y ejecutar tests unitarios con asistencia de herramientas de IA**, verificando la lógica interna del módulo asignado.
- **Reflexionar sobre la relación entre la calidad de la especificación de requerimientos (TP1)** y la facilidad o dificultad de escribir tests sobre esa funcionalidad.

---

## 2. Conocimiento Previo Requerido

- Requerimientos y User Stories del módulo asignado (TP1 y TP2).
- Conceptos básicos de HTML, CSS y JavaScript/TypeScript para construir el frontend mínimo.
- Lectura del material teórico introductorio adjunto en el aula virtual.
- Nociones básicas de testing: qué es un test, qué es una aserción, diferencia entre test E2E y test unitario.

---

## 3. Recursos Necesarios

| Recurso | Detalle |
| :--- | :--- |
| **Hardware** | Al menos una computadora por equipo con acceso a internet. |
| **Cypress** | `https://www.cypress.io/` - Herramienta de testing E2E. |
| **Testcraft (opcional)** | `https://home.testcraft.app/` - Generación de tests asistida por IA. |
| **Herramientas de IA** | Antigravity, Cursor, GitHub Copilot, ChatGPT u otra de elección del equipo. |
| **Gestión de código** | Git + repositorio remoto (GitHub). |
| **Documentación base** | Enunciado AgendaYA, requerimientos del TP1 y User Stories del TP2 (`docs/PROJECT_CONTEXT.md`). |

---

## 4. Premisas y Reglas de Trabajo

- **Responsabilidad Individual:** El trabajo es grupal, pero **cada integrante tiene responsabilidad individual sobre al menos un (1) test E2E y cinco (5) tests unitarios**. El informe debe identificar qué desarrolló cada integrante.
- **Frontend Mínimo Grupal:** El frontend mínimo es un entregable grupal: todos los integrantes deben comprender su estructura, aunque no todos hayan escrito el mismo código.
- **Control de Versiones:** Todo el código desarrollado (frontend + tests) debe estar versionado en el repositorio Git. El historial de commits es parte de la evidencia de trabajo.
- **Ejecución Real:** Los tests deben ejecutarse y producir resultados visibles. No se evalúan tests que no puedan ejecutarse.
- **Uso Crítico de IA:** Se permite y se recomienda el uso de herramientas de IA para acelerar la escritura de tests, pero cada integrante debe poder explicar el test que entrega.

---

## 5. Tarea A - Construcción del Frontend Mínimo de AgendaYA

### 5.1 Descripción y Alcance
Cada equipo debe construir una aplicación web mínima que implemente al menos dos flujos completos del módulo asignado en TP1 y TP2. Esta aplicación es la base sobre la que correrán los tests de Cypress.

No se evalúa el diseño visual ni la complejidad tecnológica. Lo que se evalúa es que la aplicación tenga comportamiento real (formularios que validan, botones que responden, estados que cambian) y que esté preparada para ser testeada.

> [!IMPORTANT]
> El frontend es un medio, no el fin de este TP. El objetivo real es el testing (Tareas B y C), no construir una aplicación completa.
> - Se recomienda usar herramientas de IA para generar o complementar el frontend con sus atributos `data-cy`.
> - El alcance debe ser mínimo: solo los flujos obligatorios del módulo.
> - No hace falta backend real: los datos pueden guardarse en memoria (`mockDb.ts`) o en el almacenamiento del navegador. Lo importante es que el comportamiento sea observable y testeable.

### 5.2 Requisito Técnico Clave: Atributos `data-cy`
Para que los tests de Cypress sean mantenibles y no dependan de clases CSS o texto visible, **todos los elementos interactivos deben tener un atributo `data-cy` con un nombre descriptivo**.

```html
<!-- Ejemplos correctos -->
<input data-cy="email-input" type="email" placeholder="Email" />
<button data-cy="submit-booking" type="submit">Confirmar reserva</button>
<div data-cy="booking-confirmation">Tu reserva fue confirmada.</div>

<!-- Ejemplo incorrecto: Cypress dependería de texto o clase -->
<button class="btn-primary">Confirmar reserva</button>
```

En Cypress, el selector correspondiente será:
```javascript
cy.get('[data-cy="submit-booking"]').click()
cy.get('[data-cy="booking-confirmation"]').should('be.visible')
```

### 5.3 Flujos Mínimos por Módulo (Grupo 7)

| Módulo | Flujo Obligatorio | Flujo Opcional |
| :--- | :--- | :--- |
| **M03 - Tipos de Evento** | **Crear tipo de evento / Editar tipo de evento** | Eliminar tipo de evento |
| **M04 - Booking Público** | **Seleccionar fecha y hora / Completar formulario y confirmar reserva** | Manejo de horario no disponible / Concurrencia |

### 5.4 Criterios de Aceptación del Frontend
El frontend mínimo se considera válido si cumple todos los siguientes puntos:
- [ ] Los dos flujos obligatorios del módulo son navegables sin errores en el navegador.
- [ ] Todos los elementos interactivos tienen atributo `data-cy`.
- [ ] Los formularios validan al menos el caso de campo vacío y muestran un mensaje de error visible.
- [ ] Al completar un flujo exitosamente, el sistema muestra un mensaje o estado de confirmación visible.
- [ ] El código está en un repositorio Git con al menos 3 commits descriptivos que muestren el progreso.

---

## 6. Tarea B - Tests E2E con Cypress

### 6.1 Descripción
Cada integrante del equipo debe desarrollar al menos **1 test E2E** con Cypress sobre el frontend construido en la Tarea A. El test debe cubrir un flujo completo del módulo, incluyendo el estado final esperado.

### 6.2 Estructura Mínima y Patrón Obligatorio
Todo test E2E debe seguir obligatoriamente el patrón **Arrange / Act / Assert**, con los comentarios explícitos en el código para facilitar la revisión:

```javascript
describe('AgendaYA - [Nombre del módulo]', () => {
  beforeEach(() => {
    cy.visit('/') // O ruta relativa según baseUrl en cypress.config.js
  })

  it('[Descripción del flujo que se testea]', () => {
    // Arrange: preparar el estado inicial
    cy.get('[data-cy="email-input"]').type('usuario@test.com')
    cy.get('[data-cy="password-input"]').type('Password123')

    // Act: ejecutar la acción principal
    cy.get('[data-cy="login-button"]').click()

    // Assert: verificar el resultado esperado
    cy.get('[data-cy="dashboard-welcome"]').should('be.visible')
    cy.url().should('include', '/dashboard')
  })
})
```

> [!NOTE]
> Configurar `baseUrl` en `cypress.config.ts` (ej. `http://localhost:3000`) una sola vez y usar rutas relativas en los tests (`/tipos-de-evento`, `/reserva`).
> Para M03 Desktop, configurar viewport de al menos `1280x720` para satisfacer la guarda de pantalla de escritorio.

### 6.3 Flujos a Cubrir por Módulo
Cada integrante elige uno de los flujos de su módulo para testear. El equipo **no puede tener dos tests sobre exactamente el mismo flujo**: deben cubrir flujos distintos o variantes distintas del mismo flujo.

Variantes recomendadas para aumentar cobertura:
- **Flujo principal (happy path):** todo sale bien.
- **Flujo de error por datos inválidos:** campo vacío, formato incorrecto, duración inválida, etc.
- **Flujo de error por estado del sistema:** horario no disponible, turno colisionado, etc.

### 6.4 Ejecución y Evidencia
- Ejecutar los tests con `npx cypress run` (modo headless) o `npx cypress open` (modo interactivo).
- Incluir en el informe capturas de pantalla o video de la ejecución.
- Si algún test falla, documentar el mensaje completo y la decisión tomada (corregir frontend, ajustar test o documentar bug).

---

## 7. Tarea C - Tests Unitarios con IA

### 7.1 Descripción y Criterios
Cada integrante debe desarrollar al menos **5 tests unitarios** sobre la lógica del módulo asignado, utilizando herramientas de IA para asistir en la escritura.
- Los tests deben verificar funciones o comportamientos específicos, no flujos completos de interfaz.
- **Criterio de cobertura:** Cada integrante debe cubrir al menos **2 funciones o comportamientos diferentes**, y dentro de cada uno probar varios casos:
  1. Caso normal (happy path).
  2. Caso límite o de borde (boundary/edge case).
  3. Caso inválido o de error (negative test).

### 7.2 Lógica Testeable en AgendaYA (Grupo 7)
- **M03 (Tipos de Evento):** Validación de campos de tipo de evento (nombre vacío, espacios, longitud), validación de duración ($> 0$), lógica de confirmación automática vs. manual, normalización y filtrado por modalidad.
- **M04 (Booking Público):** Verificación de que no se puede reservar en el pasado, cálculo del tiempo de antelación mínima, filtrado de horarios disponibles excluyendo ocupados, validación sintáctica de datos de contacto (email regex), prevención de colisiones de reserva concurrentes.

### 7.3 Estructura Mínima con Jest
```typescript
// Ejemplo con Jest y TypeScript
describe('esFechaValida', () => {
  it('retorna true si la fecha es futura', () => {
    const fechaFutura = '2027-01-01';
    expect(esFechaValida(fechaFutura)).toBe(true);
  });

  it('retorna false si la fecha es pasada', () => {
    const fechaPasada = '2020-01-01';
    expect(esFechaValida(fechaPasada)).toBe(false);
  });

  it('retorna false si la fecha es hoy', () => {
    const hoy = new Date().toISOString().split('T')[0];
    expect(esFechaValida(hoy)).toBe(false);
  });
});
```

### 7.4 Documentación Obligatoria del Uso de IA
Para cada bloque de tests generado con IA, el informe debe documentar formalmente:
1. **El prompt utilizado:** Qué se le pidió a la herramienta exactamente.
2. **El output generado:** El código exacto que produjo la herramienta.
3. **Las modificaciones realizadas:** Qué cambios se hicieron y por qué.
4. **La evaluación crítica:** ¿El test generado era correcto? ¿Cubría lo que se pedía? ¿Qué no pudo hacer la herramienta sola?

---

## 8. Reflexión Estructurada

Al finalizar las tres tareas, el equipo debe responder brevemente pero con fundamento (un párrafo por pregunta):

1. **Sobre la trazabilidad:** ¿Los requerimientos y User Stories que escribieron en TP1 y TP2 fueron suficientemente claros como para derivar tests directamente? ¿Dónde encontraron ambigüedades que dificultaron la escritura de tests?
2. **Sobre el valor de testear:** ¿Encontraron algún bug o comportamiento inesperado en el frontend al escribir los tests? ¿Qué dice eso sobre el rol del testing en el ciclo de desarrollo?
3. **Sobre el uso de IA:** ¿En qué parte del proceso la IA fue más útil: en escribir tests E2E, tests unitarios, o el código fuente mínimo? ¿Qué limitaciones encontraron?

---

## 9. Lecciones Aprendidas

Elaborar la lista de lecciones aprendidas según las pautas de cátedra, abordando al menos un eje en:
- La experiencia de construir código pensando en su testeabilidad (testability-first / data-cy).
- El uso de herramientas de IA en el proceso de testing.
- La relación entre la calidad de los requerimientos y la facilidad de escribir tests.

---

## 10. Entregables y Criterios de Evaluación

### 10.1 Presentación en Clase
- Demostración en vivo de al menos **2 tests de Cypress** ejecutándose (uno exitoso, uno de error o borde).
- Exposición de al menos **2 tests unitarios por un integrante**, explicando la lógica que verifican y cómo asistió la IA.
- Respuesta oral a las preguntas de reflexión estructurada.

### 10.2 Informe Escrito
Subir al aula virtual respetando las siguientes secciones en orden:
1. Carátula con nombre del equipo, integrantes y módulos asignados.
2. Enlace al repositorio Git con el código fuente del frontend y los tests.
3. **Tarea A:** Descripción del frontend construido, flujos implementados y criterios de aceptación cumplidos.
4. **Tarea B:** Código de cada test E2E con comentarios `Arrange/Act/Assert`, capturas o video de ejecución, y análisis de resultados.
5. **Tarea C:** Código de los tests unitarios por integrante, documentación del uso de IA (4 pasos) y evidencia de ejecución.
6. **Reflexión estructurada:** Las tres preguntas de la Sección 8.
7. **Lecciones aprendidas:** Conforme a la Sección 9.
