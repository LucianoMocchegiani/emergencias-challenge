# fix(contacts): validar phoneTypeId antes de persistir Person (AC-008)

## Resumen

Se corrige el bug en `ContactsService.create`: cuando el DTO incluye `phones` con un `phoneTypeId` inexistente, el servicio ahora valida **antes** de guardar la Person, de modo que se devuelve 400 y no se crea ningún contacto. Se añade un test que verifica que `personRepo.save` no se llama en ese caso. Se refactoriza con variable `hasPhones` y se añaden comentarios inline en `contacts.service.ts` y `activities.service.ts` (todos los métodos).

## Motivación

AC-008: si se creaba un contacto con `phones` y un `phoneTypeId` que no existía en `phone_types`, el servicio lanzaba BadRequestException pero ya había persistido la Person (inconsistencia). El usuario recibía 400 pero el contacto quedaba creado. Se reordena la lógica para validar phoneTypeIds antes de cualquier `save`.

## Criterios de Aceptación

- [x] Al crear contacto con `phones` que incluyen un `phoneTypeId` inexistente, se devuelve 400 y no se crea ningún registro en `person`.
- [x] Los tests unitarios existentes (AC-007) siguen pasando.
- [x] Test que verifica que `personRepo.save` no se llama cuando phoneTypeId es inválido.

## Cambios Técnicos

### Backend (Node.js/TypeScript)

- **contacts.service.ts (create):** Se llama a `validatePhoneTypeIds(dto.phones.map(...))` **antes** de `personRepo.create` y `personRepo.save`. Orden: (1) validar email duplicado, (2) si hay phones → validar phoneTypeIds, (3) create + save Person, (4) guardar phones, (5) guardar addresses. Sin transacción; al fallar la validación no se ejecuta ningún save. Variable `hasPhones` para no repetir la condición. Comentarios inline en todos los métodos del servicio (create, validatePhoneTypeIds, findByEmail, findByPersonalData, findOne, findContactByPhoneNumberAndType, update, remove).
- **activities.service.ts:** Comentarios inline en create y findByContactAndType (verificación de contacto, persistencia, búsqueda y formato de respuesta).

### Tests / Documentación

- **contacts.service.spec.ts:** En el test "should throw BadRequestException when phoneTypeId does not exist" se añade `expect(personRepo.save).not.toHaveBeenCalled()` para asegurar que no se persiste la Person cuando phoneTypeId es inválido.

## Testing

- `npm run test`: 11 tests pasan (app.controller, contacts.service, activities.service).
- El test de phoneTypeId inválido ahora comprueba además que `personRepo.save` no fue llamado.

## Referencias

- Ticket: AC-008
- Plan de acción: instructions/tasks/AC-008-action-plan_2026-01-31_20-33-55.md

## Deployment

### Cambios Requeridos

- [ ] No nuevas dependencias.
- [ ] No migraciones.
- [ ] No nuevas variables de entorno.
- [ ] Reiniciar servidor si está en ejecución.

### Verificación Post-Deployment

- [ ] POST /contacts con body que incluya `phones: [{ number: "...", phoneTypeId: 999 }]` (id inexistente) → 400 y el contacto no aparece en listado.

## Riesgos y Plan de Rollback

- Cambio acotado al método create; mismo contrato API (400, mensaje igual). Rollback: revertir el commit de AC-008 si hubiera regresiones.
