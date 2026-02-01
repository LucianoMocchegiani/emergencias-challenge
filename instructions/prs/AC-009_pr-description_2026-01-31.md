# feat(seed): Seed de tipos de teléfono (PhoneType) y documentación en README (AC-009)

## Resumen

Se añade una **seed** que inserta tipos de teléfono iniciales (móvil, casa, trabajo) en la tabla `phone_type`, ejecutable con `npm run seed` (idempotente: solo inserta si la tabla está vacía). Se actualiza el README con instrucciones para ejecutar la seed y se listan los tipos/ids iniciales; se aclara que los contactos con teléfonos deben usar `phoneTypeId` existentes en `phone_type`.

## Motivación

AC-009: la tabla `phone_type` se crea por TypeORM pero no tiene filas por defecto; al crear contactos con `phones` se recibe 400 ("Tipo de teléfono con id X no existe") si no hay tipos en la BD. La seed permite cargar tipos iniciales de forma repetible y el README deja claro cómo usarla y qué ids existen.

## Criterios de Aceptación

- [x] Existe una seed que inserta al menos los tipos móvil, casa, trabajo en `phone_type`.
- [x] La seed es ejecutable con `npm run seed`; si la tabla ya tiene datos, no duplica (idempotente).
- [x] El README explica cómo ejecutar la seed y lista los tipos/ids iniciales; aclara que los contactos con teléfonos requieren `phoneTypeId` existentes.

## Cambios Técnicos

### Backend (Node.js/TypeScript)

- **src/database/seed.ts:** Script que usa TypeORM DataSource (sqlite, misma ruta que la app: `process.env.DATABASE_PATH ?? './data/contacts.db'`), comprueba si `phone_type` está vacía y, si lo está, inserta tres tipos (móvil, casa, trabajo). Idempotente: no inserta si ya hay filas.
- **package.json:** Script `"seed": "ts-node -r tsconfig-paths/register src/database/seed.ts"`.

### Base de Datos (SQLite)

- Sin cambios de schema; solo inserción de datos iniciales en `phone_type`. La tabla debe existir (se crea al arrancar la app con TypeORM synchronize).

### Tests / Documentación

- **README.md:** En "Cómo empezar" se añade el paso para ejecutar la seed (`npm run seed`), la lista de tipos iniciales (1 móvil, 2 casa, 3 trabajo) y la aclaración de que los contactos con teléfonos deben usar `phoneTypeId` existentes en `phone_type`.

## Testing

- Ejecutar `npm run seed`: si la tabla está vacía, inserta los tres tipos; si ya tiene datos, no inserta y muestra mensaje.
- Tras la seed, crear un contacto con `phones: [{ number: "...", phoneTypeId: 1 }]` y verificar 201.
- Verificar que el README refleja el flujo y los tipos.

## Referencias

- Ticket: AC-009
- Plan de acción: instructions/tasks/AC-009-action-plan_2026-01-31_20-53-56.md

## Deployment

### Cambios Requeridos

- [ ] No nuevas dependencias (ts-node y tsconfig-paths ya en el proyecto).
- [ ] No migraciones; solo datos iniciales.
- [ ] Opcional: `DATABASE_PATH` si se usa otra ruta para la BD.
- [ ] La seed se ejecuta a mano o en script de provisioning; no en arranque de la app.

### Verificación Post-Deployment

- [ ] `npm run seed` ejecuta sin error (tras al menos un arranque de la app para que exista la BD/tabla si es primera vez).
- [ ] README actualizado y coherente.

## Riesgos y Plan de Rollback

- Cambio acotado: nuevo script y documentación; no modifica la API. Rollback: revertir commit de AC-009.
