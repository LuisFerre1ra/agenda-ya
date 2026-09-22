# PROJECT_CONTEXT.md

## Memoria Técnica y Documento Maestro de Ingeniería de Software
- **Sistema:** AgendaYA (Gestión Autónoma de Agenda y Reservas)
- **Cátedra:** Ingeniería y Calidad de Software — 4to. Año (2026)
- **Equipo:** Grupo 7 — Asignación exclusiva: Módulo 03 (*Tipos de Evento*) y Módulo 04 (*Proceso de Reserva / Booking Público*)
- **Repositorio y Entregas:**
  - CI/CD (TP4): `https://github.com/LuisFerre1ra/agenda-ya/tree/entrega-tp4`
  - Casos de Prueba (TP5): `https://github.com/LuisFerre1ra/agenda-ya/tree/entrega-tp5`
  - Testing Automatizado (TP6): `https://github.com/LuisFerre1ra/agenda-ya/tree/tp6` (Consigna en `docs/tp_actual/consigna.md`)
  - Tableros Ágiles: `https://trello.com/b/69d907c0b02c0d9e32cddfa8` | `https://trello.com/b/6a04e130055d4cc58944c8ea`

---

# 1. Visión General del Negocio y Dominio

## 1.1 Propósito del Sistema
AgendaYA permite a profesionales y empresas coordinar turnos y reuniones con clientes de manera desatendida. Cada profesional dispone de un enlace público (`agendaya.com/agenda/[nombre-admin]`) donde los clientes consultan disponibilidad en tiempo real y reservan turnos bajo reglas de negocio estrictas, eliminando la coordinación manual.

## 1.2 Contextos Tecnológicos y Restricciones de Diseño UX/UI

| Dimensión | Contexto Desktop (Administrador) | Contexto Mobile (Usuario Invitado) |
| :--- | :--- | :--- |
| **Actor** | Profesional / Administrador de cuenta | Cliente / Invitado |
| **Dispositivo** | Laptop / Computadora de escritorio (Navegador Web) | Smartphone ($\ge 5$ pulgadas) |
| **Filosofía UX** | Eficiencia sobre simpleza | Simpleza sobre eficiencia |
| **Carga Cognitiva** | Alta densidad de información, navegación por secciones, vistas comparativas (semana/mes). | Minimalista, botones táctiles amplios ($\ge 48\text{px}$), operable íntegramente con una sola mano. |
| **Pasos de Flujo** | N/A (Gestión CRUD y dashboards continuos). | Embudo estricto de **máximo 4 pasos**. |
| **Autenticación** | Login obligatorio con usuario y contraseña. | **Sin registro ni creación de cuenta** (Fricción cero). |
| **Atajos / Navegación**| Soporte obligatorio de atajos: `Ctrl+S` / `Cmd+S` (guardar) y `Esc` (cerrar/cancelar). | Botón de retroceso persistente para deshacer acciones entre pasos. |
| **Performance** | Tiempos de respuesta estándar de escritorio. | Flujo completo completable en **menos de 10 segundos** en red móvil estándar. |
| **Concurrencia** | Bloqueo manual de agenda disponible en cualquier momento. | Detección de colisión en el milisegundo de confirmación. Rechazo con pantalla de contingencia que preserva los datos ingresados. |

## 1.3 Integración de Módulos y Dependencias Sistémicas
- **M01 (Autenticación y Perfil de Administrador):** Provee identidad del profesional (nombre, foto de perfil, zona horaria) y el slug del enlace público para M04.
- **M02 (Gestión de Disponibilidad):** Define días laborales, rangos horarios de atención, buffers/intervalos entre turnos, antelación mínima para reservar (ej. no reservar con menos de 2h) y días bloqueados (feriados/vacaciones). M04 depende de estas reglas para computar slots válidos.
- **M03 (Tipos de Evento - GRUPO 7):** Catálogo de servicios configurados por el Admin. Define duración, modalidad, método de confirmación y descripción.
- **M04 (Proceso de Reserva - GRUPO 7):** Embudo público de 4 pasos para el invitado. Consume datos de M01, M02 y M03.
- **M05 (Gestión de Agenda y Reservas):** Registra las reservas consolidadas generadas en M04 en la vista de calendario del administrador.
- **M06 (Notificaciones y Comunicaciones):** Despacha emails transaccionales automáticos ante confirmación (a invitado y administrador) o cancelación.

---

# 2. Stack Tecnológico y Arquitectura

## 2.1 Tecnologías Centrales
- **Lenguaje:** TypeScript (v5.x) configurado con verificación estricta (`strict: true`, prohibición absoluta del tipo `any`).
- **Framework:** Next.js (App Router, Server y Client Components, Route Handlers).
- **Testing Unitario:** Jest con soporte TypeScript (`ts-jest` / compilador Next.js).
- **Testing E2E:** Cypress para verificación automatizada punta a punta sobre selectores `data-cy`.
- **Testing Manual y Gestión de Calidad:** Kiwi TCMS (planes de prueba, ejecución por roles Test Lead / Tester).
- **CI/CD:** GitHub Actions ejecutado sobre runner `ubuntu-latest`.

## 2.2 Servicios y Capa de Datos
La lógica de negocio reside desacoplada de la interfaz en servicios dedicados:
- `src/services/eventTypeService.ts`: CRUD, filtrado dinámico, ordenamiento algorítmico, búsqueda reactiva y buffer de restauración (deshacer).
- `src/services/bookingService.ts`: Cálculo de franjas horarias libres, validación de fechas pasadas, validación sintáctica de datos de contacto y reserva atómica con control de concurrencia.
- `src/database/mockDb.ts`: Persistencia volátil en memoria para ejecución de pruebas unitarias aisladas sin dependencias de I/O externo.

## 2.3 Pipeline de Integración Continua (GitHub Actions)
- **Disparadores (Triggers):** `pull_request` a la rama `main` y `push` a la rama `main`.
- **Política de Fusión:** Cero tolerancia a fallos. Cualquier paso fallido bloquea el merge.
- **Etapas Secuenciales:**
  1. *Checkout del código:* `actions/checkout`.
  2. *Configuración de entorno:* `actions/setup-node` fijado en Node.js v20 con caché de dependencias npm.
  3. *Instalación de dependencias:* `npm ci`.
  4. *Verificación de tipos estática:* `tsc --noEmit` (rechaza variables implícitas o tipos `any`).
  5. *Análisis estático (Linter):* `npm run lint` (ESLint: control de variables no utilizadas, imports huérfanos, formato).
  6. *Pruebas unitarias y cobertura:* `npm test -- --coverage` (Jest: ejecución de suites unitarias sobre servicios; cobertura mínima requerida > 70% en líneas/bloques).
  7. *Compilación de producción:* `npm run build` (build productivo de Next.js sin errores de bundle).

---

# 3. Especificación Exhaustiva de Módulos Asignados

## 3.1 Requerimientos de Ingeniería (SRS)

### Módulo 03: Tipos de Evento
- **M03-R01F (Creación):** Formulario obligatorio para nombre, duración (minutos u horas), modalidad (presencial, virtual, híbrido), método de confirmación (automática o manual) y descripción opcional. Requiere guardar explícito; salir sin guardar descarta los cambios.
  - *Precondición:* Admin autenticado en Desktop en sección "Tipos de evento".
  - *Postcondición:* Evento registrado en BD, visible en listado y activo en enlace público.
- **M03-R02F (Edición):** Modificación de todos los atributos de un evento existente.
  - *Precondición:* Sesión activa y al menos 1 tipo de evento creado.
  - *Postcondición:* Cambios impactan de inmediato en el enlace público solo para reservas futuras (las citas existentes no se alteran). Precedencia: `M03-R01F`.
- **M03-R03F (Eliminación):** Supresión de un evento tras confirmación en pop-up. Ofrece opción de deshacer (*Undo*) por unos segundos. Al eliminarse definitivamente, cancela reservas asociadas e impide nuevas citas.
  - *Precondición:* Sesión activa y al menos 1 evento existente. Precedencia: `M03-R01F`.
- **M03-R04F (Visualización y Filtros):** Grilla con atributos principales. Búsqueda por nombre, filtros por modalidad, confirmación y rango de duración (mín/máx), orden alfabético y por duración. Estado vacío si no hay coincidencias o datos. Precedencias: `M03-R01F`, `M03-R02F`, `M03-R03F`.
- **M03-R05N (Compatibilidad):** Operativo en versiones actuales de Chrome, Firefox y Safari.
- **M03-R06N (Disponibilidad):** Mínimo 99% del tiempo mensual disponible para el enlace público.
- **M03-R07N (Vista Desktop):** Diseñado para pantallas de Laptop/PC.
- **M03-R08N (Eficiencia):** Prioriza densidad y velocidad sobre simpleza.
- **M03-R09N (Atajos de Teclado):** `Ctrl+S` / `Cmd+S` para guardar, `Esc` para cancelar o cerrar modales.

### Módulo 04: Proceso de Reserva (Booking Público)
- **M04-R01F (Visualización de Catálogo Público):** Invitado accede a la URL pública y visualiza perfil del admin (nombre, foto) y tipos de evento disponibles con duración, modalidad y descripción. Precedencia: `M03-R01F`.
- **M04-R02F (Selección de Fecha y Hora):** Calendario mensual interactivo. Días ocupados o sin horario deshabilitados. Al pulsar un día válido, lista los turnos libres para su selección. Precedencias: `M04-R01F`, `M02-R01F`.
- **M04-R03F (Ingreso de Datos):** Formulario para nombre completo y correo (obligatorios), teléfono y nota (opcionales). Sin registro ni login. Precedencia: `M04-R02F`.
- **M04-R04F (Confirmación y Concurrencia):** Resumen final de la cita para validación. Al presionar "Confirmar Reserva", registra el turno atómicamente previniendo reservas concurrentes simultáneas sobre el mismo horario. Dispara notificaciones (M06). Precedencia: `M04-R03F`.
- **M04-R05N (Usabilidad Mobile):** Operable con una sola mano en pantallas de 5" o más.
- **M04-R06N (Límite de Pasos):** Flujo completable en un máximo estricto de 4 pasos.
- **M04-R07N (Rendimiento):** Flujo completo finalizado en menos de 10 segundos bajo condiciones normales de red.
- **M04-R08N (Simpleza):** Prioriza la simpleza y claridad visual sobre la densidad.
- **M04-R09N (Seguridad):** Los datos personales del invitado no deben ser accesibles públicamente bajo ninguna circunstancia.
- **M04-R10N (Vista Mobile):** Interfaz optimizada exclusivamente para dispositivos móviles.

---

## 3.2 Historias de Usuario Detalladas (TP2)

### Módulo 03: Tipos de Evento

#### US_M03_01: Crear un nuevo tipo de evento
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 5 SP | **Requerimiento:** `M03-R01F` | **Dependencias:** Ninguna
- **Descripción:** Como Administrador quiero crear un nuevo tipo de evento configurando sus atributos principales (nombre, duración, modalidad y método de confirmación) de modo que pueda habilitarlo en mi enlace público para recibir reservas.
- **Conversación:**
  - *Dev:* ¿Todos los campos en el formulario son obligatorios?  
    *PO:* No, la descripción es opcional. El resto de los campos son obligatorios.
  - *Dev:* ¿Qué sucede si el administrador intenta guardar el evento dejando un campo obligatorio vacío?  
    *PO:* El sistema debe prevenir que se introduzcan datos inconsistentes. El campo vacío debe mostrar un borde rojo con un texto de advertencia explícito, y el botón de creación debe mantenerse deshabilitado.
  - *Dev:* Respecto a la duración, ¿es un campo de texto libre?  
    *PO:* No, el administrador debe poder ingresar el valor numérico y elegir mediante un parámetro si son "minutos" u "horas".
  - *Dev:* Sobre las modalidades, ¿Permitimos selecciones múltiples?  
    *PO:* No, debe estar parametrizado para que el profesional pueda seleccionar si es exclusivamente presencial, virtual, o híbrido.
  - *Dev:* ¿Qué pasa si el administrador está llenando el formulario y cierra la ventana o sale sin presionar el botón de confirmación?  
    *PO:* En ese caso, la acción se cancela y los cambios no son guardados en el sistema.
  - *Dev:* ¿Qué sucede al guardar exitosamente?  
    *PO:* Se muestra una notificación emergente indicando el éxito. Inmediatamente el nuevo tipo de evento queda registrado, visible en el listado y habilitado en el enlace público.
- **Criterios de Aceptación:**
  - *Escenario 1 (Creación exitosa):* Cuando el administrador completa los campos obligatorios (nombre, duración, modalidad, método de confirmación) y presiona "Crear", espero que el nuevo tipo de evento quede registrado y habilitado inmediatamente en el enlace público, muestre una notificación emergente "Tipo de evento creado con éxito" y aparezca en el listado del panel.
  - *Escenario 2 (Campo obligatorio vacío):* Cuando el administrador intenta guardar dejando el campo "Nombre" vacío, espero que el sistema prevenga datos inconsistentes, muestre borde rojo y texto "El campo no puede estar vacío." en el input, y el botón de creación se mantenga deshabilitado.
  - *Escenario 3 (Cancelación del formulario):* Cuando el administrador está llenando el formulario y cierra la ventana sin presionar confirmación, espero que la acción se cancele de inmediato y los cambios se descarten sin guardarse.

#### US_M03_02: Editar un tipo de evento existente
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 3 SP | **Requerimiento:** `M03-R02F` | **Dependencias:** `US_M03_01`
- **Descripción:** Como Administrador quiero editar los detalles de un tipo de evento ya creado de modo que pueda actualizar sus atributos sin necesidad de crear uno desde cero.
- **Conversación:**
  - *Dev:* ¿Desde dónde accedo a la edición?  
    *PO:* Desde el listado general de eventos, seleccionando el icono de edición en la fila correspondiente.
  - *Dev:* ¿Qué atributos se pueden modificar?  
    *PO:* Todos. El nombre, duración, modalidad, método de confirmación y la descripción.
  - *Dev:* ¿Qué validaciones aplicamos si borran un dato obligatorio durante la edición?  
    *PO:* Si por ejemplo dejan un campo obligatorio vacío, debe mostrar un borde rojo, un texto de advertencia explícito y mantener el botón de "Guardar Cambios" deshabilitado.
  - *Dev:* ¿Qué sucede al guardar los cambios exitosamente?  
    *PO:* Se muestra una notificación emergente indicando el éxito. Inmediatamente los cambios quedan registrados, pero estos se aplican sólo a las nuevas reservas, no a las ya tomadas.
- **Criterios de Aceptación:** Edición confirmada actualiza la base de datos y la fila en la grilla con Toast de confirmación. Intento de vaciar campos obligatorios inhabilita el guardado y muestra borde rojo. Cancelación cierra el modal conservando valores originales.

#### US_M03_03: Eliminar un tipo de evento
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 2 SP | **Requerimiento:** `M03-R03F` | **Dependencias:** `US_M03_01`
- **Descripción:** Como Administrador quiero eliminar un tipo de evento ya creado de modo que deje de estar disponible para futuras reservas en mi enlace público.
- **Conversación:**
  - *Dev:* ¿Qué pasa si al momento de borrar el tipo de evento hay turnos con dicho evento seleccionado?  
    *PO:* Al eliminar el tipo de evento, todas las reservas asociadas a este tipo también serán eliminadas del sistema.
  - *Dev:* ¿El borrado es inmediato?  
    *PO:* No, para prevenir errores, el sistema debe pedir una confirmación mediante un pop-up de advertencia antes de ejecutar la acción destructiva.
  - *Dev:* ¿Y si me equivoco al confirmar en el pop-up?  
    *PO:* Debe aparecer un mensaje dando la opción de "Deshacer" por 5 segundos.
- **Criterios de Aceptación:** Exige confirmación previa en modal "¿Seguro que quieres eliminar...?". Al confirmar, elimina el elemento de la grilla y muestra Toast con botón "Deshacer" durante 5 segundos. Si se pulsa "Deshacer", se restaura el registro. Si se cancela en el pop-up, el evento se mantiene intacto.

#### US_M03_04: Visualizar listado base de tipos de evento creados
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 3 SP | **Requerimiento:** `M03-R04F` | **Dependencias:** `US_M03_01`
- **Descripción:** Como Administrador quiero visualizar un listado consolidado de todos los tipos de evento de modo que pueda tener un panorama general de todos los tipos de evento que tengo disponibles en mi sistema.
- **Conversación:**
  - *Dev:* ¿Qué información se muestra por fila?  
    *PO:* Todos los atributos principales: nombre, duración, modalidad, método de confirmación y descripción.
  - *Dev:* ¿Qué pasa si no hay ningún tipo de evento?  
    *PO:* El sistema debe desplegar un "estado vacío" invitando al administrador a crear su primer tipo de evento.
  - *Dev:* ¿Qué pasa si la descripción es muy larga y rompe el diseño de la tabla?  
    *PO:* El texto debe truncarse mostrando puntos suspensivos.
  - *Dev:* ¿Qué acciones se pueden tomar desde este listado?  
    *PO:* El administrador debe poder seleccionar un tipo de evento del listado para editarlo o eliminarlo, y debe tener a la vista un botón para crear un nuevo tipo de evento.
- **Criterios de Aceptación:** Renderizado de grilla completa con columnas correspondientes. Descripciones largas truncadas con ellipsis (`...`). Estado vacío si la cuenta no posee registros.

#### US_M03_05: Filtrar listado de tipos de evento
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 3 SP | **Requerimiento:** `M03-R04F` | **Dependencias:** `US_M03_04`
- **Descripción:** Como Administrador quiero filtrar los tipos de evento en la lista por duración, tipo de confirmación y/o modalidad de modo que pueda encontrar rápidamente tipos de evento específicos.
- **Conversación:**
  - *Dev:* ¿Qué filtros exactos vamos a incluir en esta historia?  
    *PO:* Incluiremos los filtros por duración, modalidad y método de confirmación.
  - *Dev:* Sobre el filtro de duración, ¿el administrador ingresa un valor exacto?  
    *PO:* No, el sistema debe permitir filtrar estableciendo un rango, ingresando una duración mínima y una máxima.
  - *Dev:* ¿Se puede utilizar más de un filtro a la vez?  
    *PO:* Sí, debe poder utilizar múltiples filtros de forma simultánea.
  - *Dev:* ¿Qué ocurre si al aplicar los filtros no hay ningún evento que coincida?  
    *PO:* El sistema debe mostrar un estado vacío indicando que no se encontraron resultados.
- **Criterios de Aceptación:** Filtrado dinámico por modalidad (Presencial/Virtual), confirmación (Automática/Manual) y duración (rango mín/máx). Admite filtros combinados. Si no hay coincidencias, muestra "No se encontraron resultados".

#### US_M03_06: Ordenar elementos de la lista de tipos de evento
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 2 SP | **Requerimiento:** `M03-R04F` | **Dependencias:** `US_M03_04`
- **Descripción:** Como Administrador quiero cambiar el orden de los eventos en la lista de modo que pueda organizar la información visualmente según mi preferencia.
- **Conversación:**
  - *Dev:* ¿Por cuáles atributos se permite ordenar la tabla?  
    *PO:* Se debe poder cambiar el orden por orden alfabético o por duración.
  - *Dev:* ¿El ordenamiento aplica a la vista completa junto con los filtros aplicados?  
    *PO:* Sí, debe ordenar los resultados que se estén visualizando en ese momento en la pantalla.
  - *Dev:* ¿El ordenamiento afecta a la vista pública de los clientes?  
    *PO:* No, es solo una preferencia visual para el administrador en su panel de control.
- **Criterios de Aceptación:** Botón de ordenamiento que alterna cíclicamente: Alfabético A-Z / Z-A y Duración Ascendente / Descendente sobre el dataset visible. No altera la vista del cliente en M04.

#### US_M03_07: Búsqueda rápida de tipos de eventos
- **Épica:** `M03_GESTION_TIPO_EVENTOS` | **Estimación:** 1 SP | **Requerimiento:** `M03-R04F` | **Dependencias:** `US_M03_04`
- **Descripción:** Como Administrador quiero buscar tipos de evento específicos ingresando su nombre en una barra de búsqueda de modo que pueda acceder a ellos sin necesidad de hacer scroll por toda la lista.
- **Conversación:**
  - *Dev:* ¿La búsqueda requiere tocar un botón de "Buscar" o es reactiva?  
    *PO:* Debe ser reactiva. A medida que escribo, la lista se va actualizando en pantalla.
  - *Dev:* ¿La búsqueda distingue entre mayúsculas, minúsculas o tildes?  
    *PO:* No, debe ser flexible para mejorar la usabilidad.
  - *Dev:* ¿Y qué mostramos si escribo un nombre y no hay resultados?  
    *PO:* La tabla debe vaciarse y mostrar un mensaje claro: "No se encontraron eventos con ese nombre".
- **Criterios de Aceptación:** Filtrado reactivo en tiempo real en el input de búsqueda. Coincidencia insensible a mayúsculas, minúsculas y tildes. Mensaje informativo de ausencia de resultados si no hay match.

---

### Módulo 04: Proceso de Reserva (Booking Público)

#### US_M04_01: Visualizar perfil y eventos disponibles (Paso 1)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 3 SP | **Requerimiento:** `M04-R01F` | **Dependencias:** `US_M03_01`
- **Descripción:** Como Usuario invitado quiero acceder al enlace público y ver el perfil del profesional junto con sus eventos disponibles de modo que pueda seleccionar el que necesito reservar.
- **Conversación:**
  - *Dev:* ¿Qué información del profesional se debe mostrar al ingresar al enlace?  
    *PO:* En la parte superior se debe visualizar el nombre y la foto de perfil del profesional o empresa.
  - *Dev:* ¿Y qué detalles se muestran por cada tipo de evento disponible?  
    *PO:* Se debe mostrar el título, la modalidad, la duración y la descripción.
  - *Dev:* ¿Qué acción toma el usuario aquí?  
    *PO:* Toca el evento que desea y el sistema debe guardar esa selección en memoria para avanzar automáticamente al paso de selección de fecha y hora.
- **Criterios de Aceptación:** Carga del header con datos del admin y lista de eventos activos. Tocar una tarjeta de evento guarda la selección en memoria y avanza automáticamente al Paso 2.

#### US_M04_02: Navegar calendario interactivo (Paso 2a)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 5 SP | **Requerimiento:** `M04-R02F` | **Dependencias:** `US_M04_01`
- **Descripción:** Como Usuario invitado quiero visualizar un calendario mensual interactivo de modo que pueda identificar rápidamente qué días tienen disponibilidad para el evento que seleccioné.
- **Conversación:**
  - *Dev:* ¿Cómo sé si un día está disponible o no?  
    *PO:* Para prevenir errores, los días que ya están ocupados se muestran en color rojo, y los días que no tienen horarios directamente en color gris y no son seleccionables.
  - *Dev:* ¿El calendario muestra solo el mes actual?  
    *PO:* Muestra un mes a la vez, pero debe tener controles para navegar hacia los meses siguientes.
  - *Dev:* Si el usuario se da cuenta de que eligió el evento equivocado en el paso anterior, ¿puede retroceder?  
    *PO:* Sí, se le debe dar la opción de volver al paso 1 mediante un botón de retroceso.
  - *Dev:* ¿Cómo avanza al siguiente paso?  
    *PO:* El usuario debe presionar el botón "Continuar" para avanzar al siguiente paso.
- **Criterios de Aceptación:** Vista mensual con navegación de meses. Días sin turnos en gris (no clickeables); días agotados en rojo; días hábiles con turnos interactivos. Botón superior para retroceder al Paso 1. Botón "Continuar" al seleccionar día y turno.

#### US_M04_03: Seleccionar franja horaria (Paso 2b)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 2 SP | **Requerimiento:** `M04-R02F` | **Dependencias:** `US_M04_02`
- **Descripción:** Como Usuario Invitado quiero ver los horarios libres de un día particular y seleccionar uno de modo que pueda apartar ese turno exacto para mi cita.
- **Conversación:**
  - *Dev:* ¿Cómo se visualizan los horarios al tocar un día?  
    *PO:* Se deben mostrar debajo del calendario como botones amplios con el rango horario.
  - *Dev:* ¿Qué pasa con los horarios que ya están reservados por otras personas en ese día?  
    *PO:* Los horarios no disponibles deben mostrarse deshabilitados.
  - *Dev:* ¿Cómo avanza al siguiente paso una vez que toca su horario?  
    *PO:* El usuario debe presionar el botón "Continuar" para avanzar al paso siguiente.
- **Criterios de Aceptación:** Despliegue de turnos disponibles como botones táctiles amplios (ej. `09:00 - 10:00`). Turnos reservados u ocupados deshabilitados. Selección persistida temporalmente; click en "Continuar" avanza al Paso 3.

#### US_M04_04: Ingresar datos personales (Paso 3)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 3 SP | **Requerimiento:** `M04-R03F` | **Dependencias:** `US_M04_03`
- **Descripción:** Como Usuario invitado quiero completar un formulario con mis datos de contacto de modo que el profesional sepa quién soy y pueda notificarme.
- **Conversación:**
  - *Dev:* ¿El usuario debe crear una cuenta?  
    *PO:* No, el usuario no necesita registrarse en absoluto.
  - *Dev:* ¿Cuáles son los campos exactos del formulario?  
    *PO:* Nombre completo y correo electrónico son obligatorios. Adicionalmente, el teléfono y una nota para el administrador son campos opcionales.
  - *Dev:* ¿Aplicamos validaciones en los campos obligatorios?  
    *PO:* Sí, el sistema no debe dejar avanzar si los campos obligatorios están vacíos o si el correo no tiene un formato válido.
  - *Dev:* ¿El usuario puede volver atrás si se equivocó de horario?  
    *PO:* Sí, debe mantenerse la opción de retroceder fácilmente al paso anterior.
  - *Dev:* ¿Qué sucede al presionar "Continuar"?  
    *PO:* El sistema guarda los datos ingresados en la sesión y avanza al paso final de confirmación de la reserva.
- **Criterios de Aceptación:**
  - *Escenario 1 (Ingreso exitoso):* Cuando el usuario completa obligatoriamente "Nombre Completo" y "Correo Electrónico" con formato válido y pulsa "Continuar", espero que el sistema no exija cuenta previa, guarde datos en memoria y avance al Paso 4.
  - *Escenario 2 (Omisión de campo obligatorio):* Cuando se deja vacío "Nombre Completo" o "Correo Electrónico" e intenta continuar, espero que se detenga el avance y se exponga una advertencia visual clara de obligatoriedad en el campo correspondiente.
  - *Escenario 3 (Correo con formato inválido):* Cuando se ingresa un correo sin formato estándar (ej. `usuario@` o `juan.com`) y se pulsa continuar, espero detección del error de formato, prevención del avance e indicación específica en el campo para corregirlo.
  - *Escenario 4 (Retroceso / Deshacer):* Cuando el usuario presiona retroceder desde el formulario de datos, espero retorno inmediato al Paso 2 conservando el estado.

#### US_M04_05: Revisar resumen de la cita (Paso 4a)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 1 SP | **Requerimiento:** `M04-R04F` | **Dependencias:** `US_M04_04`
- **Descripción:** Como Usuario invitado quiero visualizar una pantalla con el resumen completo de la reserva antes de finalizar de modo que pueda verificar que no cometí errores en la fecha u hora elegida.
- **Conversación:**
  - *Dev:* ¿Qué información exacta se agrupa en este resumen?  
    *PO:* Debemos mostrar los detalles de la cita (evento, fecha, hora, modalidad) y los datos personales (nombre, correo, teléfono y nota).
  - *Dev:* ¿Y si el usuario lee el resumen y nota que se equivocó en el correo o en la hora?  
    *PO:* Debe tener la opción visual de retroceder fácilmente para modificar sus datos o cambiar el turno.
- **Criterios de Aceptación:** Consolida la totalidad de la información (cita y contacto) en una sola vista (Regla 8 de Shneiderman). Dispone de acción visible de retroceso para corregir datos sin perder la sesión.

#### US_M04_06: Confirmar y registrar reserva (Paso 4b)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 5 SP | **Requerimiento:** `M04-R04F` | **Dependencias:** `US_M04_05`
- **Descripción:** Como Usuario invitado quiero confirmar mi solicitud mediante un botón final de modo que mi turno quede agendado oficialmente en el sistema del administrador y reciba la confirmación.
- **Conversación:**
  - *Dev:* ¿Qué ocurre cuando el usuario presiona "Confirmar"?  
    *PO:* El sistema debe procesar la reserva y registrar el turno. A partir de ese milisegundo, ese horario deja de estar disponible para otros usuarios.
  - *Dev:* Una vez la reserva es exitosa, ¿qué sucede?  
    *PO:* El sistema debe enviar automáticamente un email con los detalles de la cita al usuario invitado y una notificación al administrador. El usuario ve una pantalla de éxito y un botón para volver al inicio.
- **Criterios de Aceptación:** Asentamiento definitivo de la reserva en BD. El slot pasa a ocupado de forma inmediata. Se despachan notificaciones por email al invitado y admin. Muestra pantalla completa de confirmación exitosa con botón "Volver al Inicio" (Regla 4 de Shneiderman).

#### US_M04_07: Prevención de reservas superpuestas (Concurrencia)
- **Épica:** `M04_RESERVA_PUBLICA` | **Estimación:** 5 SP | **Requerimiento:** `M04-R04F` | **Dependencias:** `US_M04_06`
- **Descripción:** Como Administrador quiero que el sistema impida que dos usuarios reserven el mismo turno exacto al mismo tiempo de modo que nunca tenga citas superpuestas en mi agenda.
- **Conversación:**
  - *Dev:* ¿Qué sucede si dos usuarios invitados presionan "Confirmar Reserva" para el mismo día y hora casi en el mismo milisegundo?  
    *PO:* El sistema debe procesar la primera solicitud que ingrese y asignar el turno. Para la segunda solicitud, el sistema debe prevenir la concurrencia y rechazar la reserva.
  - *Dev:* ¿Qué le mostramos al usuario cuya reserva fue rechazada?  
    *PO:* A pantalla completa debe decir "Turno Ocupado: Lo sentimos, este turno ya no se encuentra disponible" y mostrar un botón de "Elegir otro turno".
  - *Dev:* Si presiona "Elegir otro turno", ¿a dónde lo enviamos?  
    *PO:* El sistema debe redirigirlo al paso de selección de fecha y hora para que elija un nuevo espacio, conservando los datos personales que ya ingresó para no hacerle perder tiempo.
- **Criterios de Aceptación:** Manejo atómico en persistencia. Ante colisión de dos usuarios en el mismo milisegundo, el primero confirma exitosamente y el segundo recibe pantalla de error "Turno Ocupado: Lo sentimos, este turno ya no se encuentra disponible". Al presionar "Elegir otro turno", redirige al Paso 2 **manteniendo los datos personales ingresados en el Paso 3 intactos en memoria**.

---

# 4. Matriz Consolidada de Validación, Pruebas y Casos de Borde

Esta matriz consolida las aserciones de pruebas unitarias automatizadas en Jest (`eventTypeService.test.ts` y `bookingService.test.ts` - TP4) con los casos de prueba funcionales registrados en Kiwi TCMS (`CP-M03-001` al `CP-M03-014` - TP5).

| ID Test / Regla | Módulo | Tipo | Datos de Prueba / Input | Validación y Comportamiento Esperado (UI / Servicio) |
| :--- | :--- | :--- | :--- | :--- |
| **CP-M03-001** / `unit` | M03 | Positiva | Nombre: "Entrevista de Selección", Duración: 45 min, Modalidad: Virtual, Confirmación: Manual, Desc: "" | Creación exitosa. Servicio retorna entidad creada con nuevo ID. Modal se cierra; Toast verde "Tipo de evento creado con éxito"; fila agregada a la tabla. |
| **CP-M03-002** / `unit` | M03 | Negativa | Duración: `-15` o `0` | Rechazo de duraciones nulas o negativas. El servicio arroja error de validación. Botón "Guardar Cambios" / "Crear" se deshabilita automáticamente en la UI. |
| **CP-M03-003** / `unit` | M03 | Negativa | Nombre: `""` (cadena vacía) | Rechazo de nombre ausente. Servicio lanza error. Input se bordea en rojo, mensaje "El campo no puede estar vacío." y botón deshabilitado en gris. |
| **CP-M03-004** | M03 | Negativa | Teclas pulsadas en duración: `"A"`, `"b"`, `"-"`, `"#"` | Restricción de caracteres. Input numérico bloquea eventos de teclado alfabéticos y símbolos; no registra valores no numéricos. |
| **CP-M03-005** / `unit` | M03 | Negativa | Nombre: `"   "` (espacios en blanco) | Sanitización obligatoria (`trim()`). Tratado como campo vacío: borde rojo, mensaje "El campo no puede estar vacío." y botón deshabilitado. |
| **CP-M03-006** / `unit` | M03 | Positiva | Editar "Taller Grupal" -> Nombre: "Consulta de Diagnóstico" | Actualización en base de datos. Modal carga datos existentes; guarda cambios, muestra Toast verde de éxito y actualiza la fila. Aplica solo a reservas futuras. |
| **CP-M03-007** / `unit` | M03 | Positiva | Eliminar evento y click en "Deshacer" | Deshacer eliminación (*Undo*). Evento sale de lista activa; Toast amarillo muestra botón "Deshacer" por 5s; click en botón restaura la entidad a la lista. |
| **CP-M03-008** / `unit` | M03 | Negativa | Modal eliminación -> Click "Cancelar" | Cancelación de borrado. Pop-up se cierra; el servicio no ejecuta la baja y la tabla permanece intacta. |
| **CP-M03-009** / `unit` | M03 | Positiva | Filtro Modalidad: "Virtual" | Filtrado específico. La grilla actualiza reactivamente mostrando únicamente registros con modalidad virtual. |
| **CP-M03-010** | M03 | Positiva | Filtro Confirmación: "Manual" | Filtrado específico. La grilla actualiza mostrando exclusivamente eventos con método de confirmación manual. |
| **CP-M03-011** | M03 | Negativa | Rango duración: Mín `60` > Máx `15` | Validación de rango ilógico. Servicio o UI filtra sin romper la tabla; muestra mensaje de estado vacío: "No hay tipos de eventos que coincidan con la búsqueda.". |
| **CP-M03-012** / `unit` | M03 | Positiva | Búsqueda por texto: `"Grup"` | Búsqueda reactiva insensible a mayúsculas/minúsculas y tildes. Filtra en tiempo real; expone únicamente "Taller Grupal". |
| **CP-M03-013** / `unit` | M03 | Positiva | Botón cíclico de ordenamiento | Alternancia consecutiva: Alfabético Descendente -> Duración Ascendente -> Duración Descendente. |
| **CP-M03-014** | M03 | Negativa | Descripción: string continuo de 300 caracteres | Prevención de rotura visual. La celda trunca el contenido mediante puntos suspensivos (`...`), impidiendo desbordamiento horizontal. |
| **M03-ED-CANCEL** / `unit` | M03 | Positiva | Iniciar edición y cerrar modal / pulsar `Esc` | Preservación de estado original. Ningún atributo del evento es mutado en `mockDb`. |
| **M03-DEL-NOID** / `unit` | M03 | Negativa | Invocar eliminación con ID inexistente | Manejo de excepción controlada en servicio. Arroja error de entidad no encontrada sin crash del sistema. |
| **M04-SLOTS-OK** / `unit` | M04 | Positiva | Consultar slots para evento de 30m en día laboral | Generación correcta de intervalos horarios disponibles según la duración configurada y horarios de trabajo. |
| **M04-PAST-DATE** / `unit` | M04 | Negativa | Consultar o seleccionar fecha/hora en el pasado | Bloqueo temporal estricto. El motor excluye horarios anteriores al timestamp actual (`Date.now()`) o con antelación menor a la mínima. |
| **M04-SLOT-OCC** / `unit` | M04 | Negativa | Consultar día con horario previamente reservado | Exclusión de solapamiento. Las franjas ya registradas se excluyen o se renderizan en gris/deshabilitadas. |
| **M04-DATA-REQ** / `unit` | M04 | Positiva | Enviar solo: Nombre completo y Email válido | Aprobación de datos mínimos. El servicio acepta la reserva sin requerir teléfono ni nota opcional. |
| **M04-EMAIL-INV** / `unit` | M04 | Negativa | Email: `"usuario@"`, `"juan.com"` | Rechazo sintáctico. El sistema detiene el avance al Paso 4 y marca advertencia en el input de correo. |
| **M04-DATA-OPT** / `unit` | M04 | Positiva | Enviar teléfono y nota adicional | Persistencia integral. Los campos opcionales son almacenados correctamente en el objeto de reserva. |
| **M04-RACE-COND** / `unit` | M04 | Negativa | Dos peticiones de confirmación simultáneas sobre el mismo slot | Control de concurrencia atómico. El primer commit se asienta; el segundo arroja error de colisión, muestra pantalla "Turno Ocupado" y botón "Elegir otro turno" manteniendo los datos de contacto en memoria. |

---

# 5. Convenciones de Desarrollo y Buenas Prácticas

## 5.1 Gestión de Tipos y Contratos de Datos
- **Directiva:** **Consultar las interfaces, tipos y firmas existentes directamente en `src/services/` y `src/database/mockDb.ts`**. No duplicar interfaces en archivos locales ni generar definiciones redundantes.
- Utilizar exclusivamente las definiciones tipadas del proyecto para `EventType`, `Booking`, DTOs de creación/actualización y enums de `Modalidad` y `ConfirmationMethod`.
- El uso de `any` está prohibido y bloquea el pipeline de CI en el step de compilación TypeScript (`tsc --noEmit`).

## 5.2 Reglas de Arquitectura e Inmutabilidad
- **Inmutabilidad en `mockDb`:** No mutar arrays directamente mediante métodos destructivos (`push`, `splice`). Emplear copias inmutables (`map`, `filter`, spread operator) para evitar efectos secundarios entre ejecuciones de pruebas.
- **Normalización de Duraciones:** Todas las operaciones temporales, generación de intervalos y comparaciones deben realizarse normalizando la duración a **minutos enteros** antes de consultar la disponibilidad o persistir datos.
- **Normalización de Strings:** Todo filtrado y búsqueda de texto debe realizarse convirtiendo las cadenas a minúsculas y normalizando diacríticos Unicode (`normalize("NFD").replace(/[\u0300-\u036f]/g, "")`) para ignorar tildes y caracteres especiales.
- **Manejo Centralizado de Errores:** Los servicios deben lanzar instancias de `Error` con mensajes descriptivos ante validaciones no cumplidas (ej. campos vacíos, duración menor o igual a cero, turnos colisionados), los cuales deben ser capturados por la UI para desplegar el feedback visual correspondiente (borde rojo, toasts o pantallas de contingencia).

## 5.3 Pautas de Ergonomía UI/UX
- **Componentes Mobile (M04):**
  - Mantener los 4 pasos estrictos sin recargar la página.
  - Asegurar un área táctil mínima de $48\text{px}$ para todos los botones de acción primarios.
  - El estado del formulario de contacto (Paso 3) debe residir en el estado del cliente para no perder los datos si el usuario retrocede al calendario o si ocurre una colisión de concurrencia en el Paso 4.
- **Componentes Desktop (M03):**
  - Registrar listeners de teclado para `Ctrl+S` / `Cmd+S` y `Esc` en modales de administración, asegurando ejecutar `event.preventDefault()` y limpiar los listeners en el desmontaje del componente (`cleanup` de `useEffect`).
  - Las acciones destructivas (eliminación) deben contar con diálogo modal de confirmación y un Toast interactivo temporal de 5 segundos con callback para la función de deshacer (*Undo*).