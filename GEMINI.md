# Directivas de Contexto de Proyecto (AgendaYA - Grupo 7)

1. Dominio y Especificaciones Base:
   - Antes de responder sobre lógica, endpoints o interfaces, consultá siempre `docs/PROJECT_CONTEXT.md`.
   - Nuestro equipo es el Grupo 7 (dueños exclusivos de Módulo 03 y Módulo 04).

2. Consigna de Trabajo en Curso:
   - Toda tarea a implementar debe cumplir con los requerimientos descritos en `docs/tp_actual/consigna.md` en caso de estar presente.

3. Restricciones Técnicas Estrictas:
   - Lenguaje: TypeScript en modo estricto (`strict: true`). Prohibido el uso de `any`.
   - Servicios base: `services/eventTypeService.ts` y `services/bookingService.ts` (almacén volátil en `database/mockDb.ts`).
   - Ramas de trabajo: `main` representa Producción (con reglas de protección de rama / PR obligatorio). Cada trabajo práctico utiliza su propia rama de desarrollo e integración (ej. `tp6`, `tp7`, etc.).
   - Testing: Si se introduce una función, escribir su test unitario en Jest respetando `mockDb.ts` y mantener suites E2E en Cypress.
   - CI/CD: Asegurá que todo cambio pase el pipeline (`.github/workflows/node.js.yml`): `npm run lint`, `npx tsc --noEmit`, `npm test` y `npm run build`.