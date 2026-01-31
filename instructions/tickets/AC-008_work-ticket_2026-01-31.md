# AC-008 - ContactsService.create: validar phoneTypeId antes de persistir Person

## Tipo
- [x] Bugfix (corrección de error)
- [ ] Feature (nueva funcionalidad)
- [ ] Refactor (mejora de código sin cambiar funcionalidad)

## Prioridad
- [x] Alta (bloquea consistencia de datos)
- [ ] Media
- [ ] Baja

## Descripción

### Problema/Requerimiento

En `ContactsService.create`, si el DTO incluye `phones` con un `phoneTypeId` que no existe en la tabla `phone_types`, el servicio lanza `BadRequestException` ("Tipo de teléfono con id X no existe") **pero ya ha persistido la Person** en el paso anterior. El cliente recibe 400 pero el contacto queda creado en la base de datos (inconsistencia).

### Comportamiento Actual

1. Se valida que el email no exista.
2. Se crea y guarda la Person.
3. Si hay `phones`, se llama a `validatePhoneTypeIds`; si algún id no existe, se lanza BadRequestException.
4. El contacto ya está guardado cuando se lanza la excepción.

### Comportamiento Esperado

- Si algún `phoneTypeId` no existe, **no** se debe persistir el contacto y se debe devolver 400.
- Opciones: (a) validar `phoneTypeIds` **antes** de guardar la Person, o (b) ejecutar create (Person + phones) dentro de una **transacción** y hacer rollback si falla la validación o el guardado de phones.

## Criterios de Aceptación

1. [ ] Al crear contacto con `phones` que incluyen un `phoneTypeId` inexistente, se devuelve 400 y **no** se crea ningún registro en `person` (ni el contacto).
2. [ ] Los tests unitarios existentes (AC-007) siguen pasando; opcional: añadir test que verifique que `personRepo.save` no se llama cuando phoneTypeId es inválido (o que se hace rollback).

## Contexto Técnico

### Componentes Afectados
- [x] Backend (NestJS)
- [x] src/contacts/contacts.service.ts

### Dependencias
- Detectado durante AC-007 (tests unitarios).
- Corrige bug de orden de operaciones en `create`.

## Referencias

- Repaso AC-004 (decisión reemplazo phones/addresses).
- AC-007 plan: Paso 5 (registrar bugs como tickets de corrección).
