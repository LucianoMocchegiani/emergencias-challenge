# Reglas de Cursor para Backend Challenge (Agenda de Contactos)

Este directorio contiene reglas personalizadas para Cursor AI (archivos `.mdc`) que ayudan a estructurar y estandarizar el trabajo de desarrollo en el proyecto Backend Challenge (agenda de contactos).

## Estructura

```
instructions/
├── README.md                      # Este archivo
├── project-context.mdc           # Contexto esencial del proyecto (siempre activo)
├── tech-stack.mdc                # Stack elegido: NestJS + Swagger (siempre activo)
├── action-plan-rule.mdc          # Genera planes de acción desde tickets
├── pr-description.mdc            # Genera descripciones de PRs
├── work-ticket.mdc               # Genera tickets de trabajo
├── code-documentation.mdc         # Agrega documentación inline (siempre activo)
├── readme-rule.mdc               # Práctica de READMEs en módulos (siempre activo)
├── token-saving-rule.mdc         # Optimiza uso de tokens (siempre activo)
├── code-cleanup-rule.mdc         # Mantiene código limpio (siempre activo)
├── readme-roadmap-update-rule.mdc # Actualiza README raíz y roadmap
├── architecture-analysis-rule.mdc # Genera análisis de arquitectura
├── QUICK_REFERENCE.md            # Guía rápida de comandos
├── /tasks/                       # Planes de acción generados
├── /prs/                         # Descripciones de PRs generadas
└── /tickets/                     # Tickets de trabajo generados
```

## ¿Qué son las Reglas de Cursor?

Las reglas de Cursor (archivos `.mdc`) son instrucciones especiales que guían al asistente de IA para realizar tareas específicas de manera consistente. Son especialmente útiles para:

- Mantener estándares de código
- Documentar cambios de manera estructurada
- Planificar implementaciones complejas
- Generar documentación automáticamente

## Reglas Disponibles

### 1. `project-context.mdc` (Always Apply)

**Propósito:** Proporciona contexto esencial del proyecto al inicio de cada conversación con la IA.

**Cuándo se aplica:**
- Automáticamente al iniciar cada conversación (alwaysApply: true)
- Proporciona contexto sobre el proyecto sin necesidad de explicarlo manualmente

**Qué incluye:**
- Conceptos clave del challenge (Person/Contacto, Phone, PhoneType, Address, ContactActivities)
- Stack técnico (NestJS, TypeScript, SQLite, Swagger, verbos HTTP, status codes)
- Estructura de directorios
- Convenciones del proyecto (tickets AC-XXX)
- Operaciones requeridas de la API

**Ejemplo:**
```
Al iniciar cualquier conversación, la IA automáticamente tiene contexto sobre:
- Qué es el Backend Challenge (API RESTful agenda de contactos)
- Cómo está modelada la base de datos (Person, Phone, PhoneType, Address, ContactActivities)
- Qué tecnologías se usan (NestJS, TypeScript, SQLite, Swagger)
- Dónde está cada cosa en el proyecto
```

### 2. `tech-stack.mdc` (Always Apply)

**Propósito:** Declara el stack técnico elegido para este proyecto: **NestJS** como framework y **Swagger** (@nestjs/swagger) para documentación de la API.

**Cuándo se aplica:**
- Automáticamente en cada conversación (alwaysApply: true)
- Asegura que planes, tickets, código y documentación usen NestJS y Swagger (no Express ni otros)

**Qué establece:**
- Framework: NestJS (módulos, controladores, servicios, DTOs, class-validator)
- Documentación API: Swagger con decoradores en controladores
- Base de datos: SQLite (TypeORM, Prisma o módulo propio)
- Tests: Jest; Linter: ESLint

### 3. `action-plan-rule.mdc` 

**Propósito:** Genera un plan de acción detallado paso a paso para implementar una feature o bugfix.

**Cuándo usar:**
- Al comenzar una nueva tarea/ticket
- Cuando necesitas estructurar una implementación compleja
- Para desglosar requerimientos en pasos accionables

**Cómo usar:**
1. Abre Cursor y describe el ticket o requerimiento
2. Menciona: "Necesito un action plan para [descripción del ticket]"
3. El asistente generará un archivo en `/tasks/[TICKET-ID]-action-plan_[FECHA-HORA].md` (con fecha y hora en formato `yyyy-MM-dd_HH-mm-ss`)
4. Sigue los pasos del plan uno por uno

**Ejemplo:**
```
Usuario: "Necesito un action plan para implementar el endpoint de búsqueda de actividades por contacto"
Asistente: *Genera AC-001-action-plan_2024-12-04_14-30-45.md con pasos detallados*
```

### 4. `pr-description.mdc`

**Propósito:** Genera una descripción completa de Pull Request lista para copiar.

**Cuándo usar:**
- Después de completar la implementación
- Antes de crear el PR en Git
- Cuando quieres asegurar que la descripción del PR sea completa

**Cómo usar:**
1. Completa tu implementación y commits
2. Solicita: "Genera la descripción del PR para [TICKET-ID]"
3. El asistente generará `/prs/[TICKET-ID]_pr-description_[FECHA-HORA].md` (con fecha y hora en formato `yyyy-MM-dd_HH-mm-ss`)
4. Copia y pega el contenido en Git

**Ejemplo:**
```
Usuario: "Genera la descripción del PR para AC-001"
Asistente: *Analiza commits y genera AC-001_pr-description_2024-12-04_14-30-45.md*
```

### 5. `work-ticket.mdc`

**Propósito:** Genera tickets de trabajo estructurados y completos para el proyecto.

**Cuándo usar:**
- Al identificar una nueva feature o requerimiento
- Cuando se encuentra un bug que necesita ser reportado
- Para documentar mejoras o refactorizaciones necesarias
- Al planificar nuevas funcionalidades

**Cómo usar:**
1. Describe el problema, feature o mejora que necesitas
2. Solicita: "Genera un ticket para [descripción]"
3. El asistente generará `/tickets/[TICKET-ID]_work-ticket_[FECHA-HORA].md` (con fecha y hora en formato `yyyy-MM-dd_HH-mm-ss`)
4. Usa el contenido en tu sistema de gestión de proyectos (GitHub Issues, GitLab, Jira, etc.)

**Ejemplo:**
```
Usuario: "Genera un ticket para implementar el endpoint de creación de contacto"
Asistente: *Genera AC-001_work-ticket_2024-12-04_14-30-45.md con ticket completo*
```

### 6. `code-documentation.mdc` (Always Apply)

**Propósito:** Agrega automáticamente documentación Python docstring inline a código nuevo o modificado.

**Cuándo se aplica:**
- Automáticamente cuando creas o modificas código
- Se aplica a todos los cambios (alwaysApply: true)

**Qué documenta:**
- Controladores NestJS (con decoradores Swagger)
- Servicios y lógica de negocio
- DTOs y entidades TypeScript
- Funciones exportadas
- Endpoints de API
- NO documenta: Imports/exports simples
- NO documenta: Variables locales
- NO documenta: Código boilerplate

**Ejemplo:**
```typescript
// Antes
function getContactByEmail(email: string) {
  // implementación
}

// Después (automáticamente)
/**
 * Obtiene un contacto por email.
 *
 * @param email - Email del contacto
 * @returns Contacto si existe, null si no
 * @throws Error si la consulta falla
 */
function getContactByEmail(email: string): Contact | null {
  // implementación
}
```

### 7. `readme-roadmap-update-rule.mdc`

**Propósito:** Mantiene actualizados el README raíz y el roadmap con referencias a todos los READMEs del proyecto y sincroniza el estado del proyecto.

**Cuándo usar:**
- Periódicamente para mantener la documentación actualizada
- Cuando se agregan nuevos READMEs al proyecto
- Cuando se completan tickets y el roadmap necesita actualización
- Para verificar que todas las referencias de documentación sean accesibles

**Cómo usar:**
1. Solicita: "Ejecuta la regla de actualización de README y roadmap" o "Actualiza la documentación"
2. La regla verificará:
   - Que el README raíz tenga referencias a todos los READMEs importantes
   - Que el roadmap esté sincronizado con el estado real del proyecto
   - Que las referencias cruzadas sean correctas
3. La regla actualizará solo lo necesario (evita gastar tokens innecesariamente)

**Qué verifica:**
- Existencia de sección "Documentación" en README raíz
- Referencias a todos los READMEs importantes del proyecto
- Sincronización entre roadmap y pending-tickets.md
- Consistencia en nombres de archivos y rutas
- Referencias rotas o incorrectas

**Estrategia de ahorro de tokens:**
- Usa `glob_file_search` y `grep` para verificar sin leer archivos completos
- Lee solo secciones necesarias con `offset/limit`
- Solo modifica archivos si hay diferencias detectadas

**Ejemplo:**
```
Usuario: "Ejecuta la regla de actualización de README y roadmap"
Asistente: *Verifica READMEs, roadmap y referencias, actualiza solo lo necesario*
```

### 8. `readme-rule.mdc` (Always Apply)

**Propósito:** Establece la práctica de mantener READMEs actualizados en cada carpeta/módulo del proyecto.

**Cuándo se aplica:**
- Automáticamente en todas las interacciones (alwaysApply: true)
- Proporciona contexto sobre la práctica de documentación establecida

**Qué establece:**
- Cada carpeta/módulo debe tener su `README.md` que explique qué contiene y cómo usarlo
- Contenido mínimo: título, estructura, componentes principales, ejemplos de uso, referencias
- Estilo profesional sin emojis
- Actualizar READMEs cuando se crean/modifican módulos

**Ejemplo:**
```
Al crear un nuevo módulo, la IA automáticamente sabe que debe:
- Crear un README.md en la carpeta del módulo
- Incluir estructura, componentes y ejemplos
- Referenciar READMEs hijos
- Mantener estilo profesional
```

### 9. `token-saving-rule.mdc` (Always Apply)

**Propósito:** Optimiza el uso de tokens evitando búsquedas extensas y generación de archivos innecesarios.

**Cuándo se aplica:**
- Automáticamente en todas las interacciones (alwaysApply: true)
- Prioriza ahorro de tokens sobre completitud cuando no se requiere archivo

**Qué hace:**
- Respuestas concisas cuando no se requiere generar archivos
- Evita búsquedas extensas en preguntas simples o conversacionales
- Solo hace búsquedas profundas cuando se necesita generar información para almacenar
- No genera archivos a menos que se solicite explícitamente

**Ejemplo:**
```
Usuario: "¿Cómo funciona el sistema de partículas?"
Respuesta CORRECTA (ahorra tokens): Respuesta concisa sin búsquedas extensas

Usuario: "Genera un plan de acción para implementar sistema de combate"
Respuesta CORRECTA (cuando se necesita): Activa regla correspondiente, hace búsquedas necesarias
```

### 10. `code-cleanup-rule.mdc` (Always Apply)

**Propósito:** Mantiene el código limpio, sin redundancias y elimina archivos temporales obsoletos.

**Cuándo se aplica:**
- Automáticamente cuando se crea o modifica un archivo (alwaysApply: true)
- Revisa redundancias y archivos obsoletos

**Qué revisa:**
- Funciones duplicadas que pueden consolidarse
- Lógica repetida que puede extraerse
- Imports no utilizados
- Código comentado obsoleto
- Archivos temporales que ya no se usan
- Scripts de prueba obsoletos

**Ejemplo:**
```
Al crear o modificar código, la IA automáticamente:
- Verifica si hay funciones similares que puedan reutilizarse
- Identifica imports no usados
- Sugiere consolidar lógica duplicada
- Propone eliminar archivos temporales obsoletos
```

### 11. `architecture-analysis-rule.mdc`

**Propósito:** Genera análisis de arquitectura detallados y estructurados evaluando la situación actual y proponiendo mejoras arquitectónicas escalables.

**Cuándo usar:**
- Al evaluar o mejorar la arquitectura del proyecto
- Cuando se necesita preparar el proyecto para escalar
- Para identificar problemas arquitectónicos y proponer soluciones
- Antes de grandes refactorizaciones

**Cómo usar:**
1. Solicita: "Genera un análisis de arquitectura para [descripción del problema/necesidad]"
2. Proporciona contexto relevante y ticket ID si existe
3. El asistente generará `/instructions/analysis/[TICKET-ID]-architecture-analysis_[FECHA-HORA].md` (crear carpeta analysis/ si no existe)
4. Usa el análisis como base para generar tickets y planes de acción

**Qué incluye el análisis:**
- Situación actual (backend, frontend, base de datos)
- Problemas identificados y limitaciones
- Necesidades futuras y requisitos de escalabilidad
- Arquitectura propuesta con estructura y patrones
- Plan de migración por fases
- Consideraciones técnicas y ejemplos

**Ejemplo:**
```
Usuario: "Genera un análisis de arquitectura para preparar el proyecto para nuevas operaciones de la API"
Asistente: *Genera AC-005-architecture-analysis_2024-12-04_14-30-45.md con análisis completo*
```

## Flujo de Trabajo Recomendado

### Para Features Nuevas

```mermaid
graph TD
    A[Identificar Requerimiento] --> B[Generar Ticket]
    B --> C[Generar Action Plan]
    C --> D[Implementar Paso 1]
    D --> E[Implementar Paso 2]
    E --> F[...]
    F --> G[Implementar Paso N]
    G --> H[Generar PR Description]
    H --> I[Crear PR en Git]
```

**Paso a paso:**

1. **Crear Ticket (Opcional pero recomendado)**
   ```
   "Genera un ticket para [descripción de la feature]"
   ```

2. **Planificación**
   ```
   "Necesito un action plan para [TICKET-ID]: [descripción]"
   ```

2. **Implementación Incremental**
   ```
   "Implementa el Paso 1 del action plan"
   "Implementa el Paso 2 del action plan"
   ...
   ```

3. **Documentación Automática**
   - Se aplica automáticamente mientras codificas
   - No requiere acción manual

4. **Generar PR**
   ```
   "Genera la descripción del PR para [TICKET-ID]"
   ```

5. **Crear PR en Git**
   - Copia el contenido de `/prs/[TICKET-ID]_pr-description_[FECHA-HORA].md` (busca el archivo más reciente)
   - Pégalo en la descripción del PR

### Para Bugfixes

Para bugs menores puedes omitir el action plan y ir directo a la implementación:

```
"Fix el bug [descripción]"
// Implementación
"Genera la descripción del PR para [TICKET-ID]"
```

## Convenciones del Backend Challenge

### Conventional Commits
- `feat(scope):` - Nueva funcionalidad
- `fix(scope):` - Corrección de bug
- `docs:` - Cambios en documentación
- `refactor(scope):` - Refactorización
- `chore:` - Tareas de mantenimiento
- `test:` - Agregar/modificar tests

**Scopes comunes:**
- `contacts`, `activities`, `phones`, `addresses`
- `api`, `database`

### Tecnologías Stack
- **Framework:** NestJS (Node.js + TypeScript)
- **Base de datos:** SQLite
- **Documentación API:** Swagger (@nestjs/swagger)
- **Validación:** class-validator + class-transformer (NestJS)
- **Tests:** Jest (NestJS)
- **Linter:** ESLint
- **Control de versiones:** Git, GitHub/GitLab

### Nomenclatura de Archivos Generados

Todos los archivos generados por las reglas incluyen fecha y hora en su nombre para facilitar el seguimiento y evitar conflictos:

**Formato de fecha/hora:** `yyyy-MM-dd_HH-mm-ss` (ejemplo: `2024-12-04_14-30-45`)

**Archivos afectados:**
- **Tickets:** `[TICKET-ID]_work-ticket_[FECHA-HORA].md`
  - Ejemplo: `AC-001_work-ticket_2024-12-04_14-30-45.md`
- **Action Plans:** `[TICKET-ID]-action-plan_[FECHA-HORA].md`
  - Ejemplo: `AC-001-action-plan_2024-12-04_14-30-45.md`
- **PR Descriptions:** `[TICKET-ID]_pr-description_[FECHA-HORA].md`
  - Ejemplo: `AC-001_pr-description_2024-12-04_14-30-45.md`

**Nota:** La IA ejecutará automáticamente `Get-Date -Format "yyyy-MM-dd_HH-mm-ss"` para obtener la fecha y hora actual antes de crear cada archivo. Si necesitas encontrar un archivo específico, busca por el TICKET-ID y ordena por fecha de creación.

## Tips y Mejores Prácticas

### 1. Usa Action Plans para Tareas Complejas
Si una tarea involucra más de 3 pasos o múltiples archivos, genera un action plan primero.

### 2. Implementación Incremental
Sigue los pasos del action plan uno a la vez. No intentes implementar todo de una vez.

### 3. Commits Frecuentes
Haz commits después de cada paso significativo con mensajes descriptivos.

### 4. Revisa la Documentación Generada
Aunque la documentación se genera automáticamente, revísala para asegurar que sea precisa.

### 5. Actualiza el Action Plan
Marca los pasos como completados a medida que avanzas.

### 6. Personaliza la PR Description
Aunque la descripción del PR se genera automáticamente, puedes agregar contexto adicional si es necesario.

## Configuración en Cursor

### Activar Reglas Manualmente

Si una regla no se activa automáticamente:

1. Abre la paleta de comandos (Ctrl/Cmd + Shift + P)
2. Busca "Cursor: Apply Rule"
3. Selecciona la regla que deseas aplicar

### Verificar Reglas Activas

Las reglas con `alwaysApply: true` se activan automáticamente:
- `project-context.mdc`
- `tech-stack.mdc` (NestJS + Swagger)
- `code-documentation.mdc`
- `readme-rule.mdc`
- `token-saving-rule.mdc`
- `code-cleanup-rule.mdc`

Las reglas con `alwaysApply: false` deben invocarse manualmente:
- `action-plan-rule.mdc`
- `pr-description.mdc`
- `work-ticket.mdc`
- `readme-roadmap-update-rule.mdc`
- `architecture-analysis-rule.mdc`

## Ejemplos Reales

### Ejemplo 1: Implementar Endpoint de Búsqueda de Actividades por Contacto

```
# 1. Crear Ticket (opcional pero recomendado)
"Genera un ticket para implementar búsqueda de actividades por contacto y tipo"

# 2. Planificación
"Necesito un action plan para AC-001: Búsqueda de actividades por contacto y tipo"

# 3. Implementación
"Implementa el Paso 1: Crear endpoint GET /contacts/:id/activities?type=call"
"Implementa el Paso 2: Retornar nombre, apellido, email, fecha de nacimiento"
...

# 4. Generar PR
"Genera la descripción del PR para AC-001"

# 5. Resultado
- /tickets/AC-001_work-ticket_2024-12-04_14-30-45.md
- /tasks/AC-001-action-plan_2024-12-04_14-30-45.md
- /prs/AC-001_pr-description_2024-12-04_14-30-45.md
- Código documentado automáticamente
```

### Ejemplo 2: Fix Bug de Búsqueda por Email

```
# Sin action plan (bug simple)
"Fix el bug AC-002: La búsqueda por email devuelve 500 cuando el email no existe"

# Después de implementar
"Genera la descripción del PR para AC-002"

# Resultado
- /prs/AC-002_pr-description_2024-12-04_14-30-45.md
- Código documentado
```

## Contribuir

Si necesitas agregar nuevas reglas o mejorar las existentes:

1. Crea un archivo `.mdc` en este directorio
2. Define el `description` y `alwaysApply`
3. Documenta el propósito y uso en este README
4. Prueba la regla con casos reales
5. Comparte con el equipo

## Notas

- Los archivos generados en `/tasks/` y `/prs/` deben versionarse en Git
- Sirven como documentación histórica del proyecto
- Ayudan a nuevos desarrolladores a entender decisiones de implementación

## Referencias

- [Cursor Documentation](https://docs.cursor.sh/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Node.js Documentation](https://nodejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [objetivo.md](../docs/objetivo.md) - Especificación del Backend Challenge

---

**Última actualización:** Enero 2025  
**Proyecto:** Backend Challenge - Agenda de Contactos

