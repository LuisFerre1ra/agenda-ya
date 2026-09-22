# Directivas de Contexto de Proyecto (AgendaYA - Grupo 7)

1. Dominio y Especificaciones Base:
   - Antes de responder sobre lógica, endpoints o interfaces, consultá siempre `docs/PROJECT_CONTEXT.md`.
   - Nuestro equipo es el Grupo 7 (dueños exclusivos de Módulo 03 y Módulo 04).

2. Consigna de Trabajo en Curso:
   - Toda tarea a implementar debe cumplir con los requerimientos descritos en `docs/tp_actual/consigna.md` en caso de estar presente.

3. Restricciones Técnicas Estrictas:
   - Lenguaje: TypeScript en modo estricto. Prohibido el uso de `any`.
   - Servicios base: `src/services/eventTypeService.ts` y `src/services/bookingService.ts`.
   - Testing: Si se introduce una función, escribí su test unitario en Jest respetando `mockDb.ts`.
   - CI/CD: Asegurá que los cambios pasen `npm run lint` y `tsc --noEmit`.