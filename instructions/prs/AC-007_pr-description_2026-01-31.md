# chore(AC-007): Tests (Jest) y linter (ESLint)

## Resumen

Se verificó la configuración de Jest y ESLint, se añadieron tests unitarios para ContactsService y ActivitiesService (casos de éxito y error 400/404), se corrigieron errores de lint (main.ts, specs) y se añadió el script `validate` (lint + test). Se registró el bug detectado (contacto persistido cuando phoneTypeId inválido) como ticket AC-008 para corrección en un PR separado.

## Motivación

AC-007 exige tests unitarios con Jest y ESLint sin errores para el proyecto. Sin tests en servicios críticos no hay cobertura mínima; sin lint limpio no hay estándar de código. El plan incluye registrar bugs encontrados durante la fase de test como tickets de corrección (AC-008).

## Criterios de Aceptación

- [x] `npm run test` ejecuta los tests y al menos los tests de ContactsService y ActivitiesService pasan.
- [x] Los tests cubren casos de éxito y al menos un caso de error (404, 400) por módulo crítico.
- [x] `npm run lint` ejecuta ESLint y el proyecto queda sin errores de lint.
- [x] Configuración de ESLint adecuada para TypeScript y NestJS (ya existía; se corrigieron errores en specs y main).

## Cambios Técnicos

### Backend (Node.js/TypeScript)

- **main.ts:** Llamada a `bootstrap()` cambiada a `void bootstrap()` para cumplir @typescript-eslint/no-floating-promises.
- **contacts.service.spec.ts:** Tests unitarios para ContactsService con mocks de Person, Phone, PhoneType, Address. create: éxito (email único), ConflictException (email duplicado), BadRequestException (phoneTypeId inexistente). findByEmail: éxito y null.
- **activities.service.spec.ts:** Tests unitarios para ActivitiesService con mocks de ContactActivity y Person. create: éxito (personId existe), NotFoundException (personId no existe). findByContactAndType: éxito con actividades, éxito con activities vacío, NotFoundException (personId no existe).
- **package.json:** Script `validate`: `npm run lint && npm run test`.

### Tests / Documentación

- **instructions/tasks/AC-007-action-plan_2026-01-31_20-00-32.md:** Plan de acción AC-007 (Pasos 1–6 + Paso final).
- **instructions/tickets/AC-008_work-ticket_2026-01-31.md:** Ticket de corrección: ContactsService.create debe validar phoneTypeId antes de persistir Person (bug detectado en fase de test).
- **instructions/pending-tickets.md:** Añadido AC-008 a tickets pendientes.

## Testing

- `npm run test`: 11 tests pasan (app.controller, contacts.service, activities.service).
- `npm run lint`: sin errores tras correcciones en main.ts y en specs (variables no usadas, void bootstrap).
- `npm run validate`: ejecuta lint y test en secuencia.

## Referencias

- Ticket: AC-007
- Plan de acción: instructions/tasks/AC-007-action-plan_2026-01-31_20-00-32.md
- Ticket de corrección detectado: AC-008 (validar phoneTypeId antes de persistir Person).

## Deployment

### Cambios Requeridos

- [ ] No nuevas dependencias (Jest, ESLint ya en el proyecto).
- [ ] No migraciones.
- [ ] No nuevas variables de entorno.
- [ ] Opcional: en CI/pre-commit ejecutar `npm run validate`.

### Verificación Post-Deployment

- [ ] `npm run validate` pasa en entorno local y en CI (si aplica).

## Notas Adicionales

- El bug AC-008 (contacto creado aunque phoneTypeId inválido) se corrige en un PR separado; los tests actuales validan que se lanza BadRequestException cuando phoneTypeId no existe.
