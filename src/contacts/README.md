# Módulo Contacts

Módulo de la API que expone las operaciones CRUD sobre contactos (entidad Person) y búsqueda por número y tipo de teléfono. Los contactos pueden tener teléfonos y direcciones asociados (sin CRUD separado de teléfonos ni direcciones).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /contacts | Crear contacto (201, 400 si validación falla, 409 si email duplicado). Body puede incluir `phones` y `addresses` opcionales. |
| GET | /contacts/email?email= | Búsqueda por email (200 o 404) |
| GET | /contacts/by-phone?number=&phoneTypeId= | Búsqueda por número y tipo de teléfono (200 o 404; 400 si falta number o phoneTypeId, o si el tipo no existe) |
| GET | /contacts | Búsqueda por datos personales (query params opcionales: firstName, lastName, dateOfBirth, email); 200 con lista |
| GET | /contacts/:id | Obtener contacto por id (200 o 404) |
| PATCH | /contacts/:id | Editar contacto (200, 404 o 400). Body puede incluir `phones` y `addresses` opcionales; si se envían, reemplazan los existentes. |
| DELETE | /contacts/:id | Eliminar contacto (204 No Content, 404 si no existe) |

## Teléfonos y direcciones en create/update

No hay endpoints separados para "crear teléfono" o "listar direcciones". Los teléfonos y direcciones se envían en el body de **POST /contacts** y **PATCH /contacts/:id**.

### Estructura de `phones` (array opcional)

Cada elemento:

- `number` (string, requerido)
- `phoneTypeId` (number, requerido; debe existir en la tabla PhoneType)

Ejemplo:

```json
"phones": [
  { "number": "+54 11 1234-5678", "phoneTypeId": 1 },
  { "number": "+54 11 8765-4321", "phoneTypeId": 2 }
]
```

### Estructura de `addresses` (array opcional)

Cada elemento:

- `locality` (string, requerido)
- `street` (string, requerido)
- `number` (number, número de calle/puerta)
- `notes` (string, opcional)

Ejemplo:

```json
"addresses": [
  { "locality": "CABA", "street": "Av. Corrientes", "number": 1234, "notes": "Oficina" }
]
```

### Comportamiento en PATCH

- Si se envía `phones` o `addresses`, se **reemplazan** por completo (se borran los existentes y se insertan los del body).
- Si no se envían esas claves, los teléfonos y direcciones del contacto no se modifican.
- Enviar `phones: []` o `addresses: []` borra todos los teléfonos o direcciones del contacto.

## Búsqueda por teléfono

**GET /contacts/by-phone**

- Query params obligatorios: `number` (string), `phoneTypeId` (number). Ambos son requeridos.
- Ejemplo: `GET /contacts/by-phone?number=+54%2011%201234-5678&phoneTypeId=1`
- 200 con el contacto (Person) que tiene ese teléfono con ese tipo; 404 si no existe; 400 si falta number o phoneTypeId, o si el tipo no existe.

## Estructura

- `contacts.module.ts` – Módulo NestJS; TypeOrmModule.forFeature([Person, Phone, PhoneType, Address]).
- `contacts.controller.ts` – Rutas REST.
- `contacts.service.ts` – Lógica de negocio; Person, Phone, PhoneType, Address (TypeORM).
- `dto/create-contact.dto.ts` – DTO base para creación (incluye phones y addresses opcionales).
- `dto/update-contact.dto.ts` – PartialType(CreateContactDto).
- `dto/phone-item.dto.ts` – number, phoneTypeId (para arrays en create/update).
- `dto/address-item.dto.ts` – locality, street, number, notes (para arrays en create/update).
- `dto/search-by-phone-query.dto.ts` – Query params para GET by-phone (number, phoneTypeId; ambos obligatorios).

## Dependencias

- Entidades: Person, Phone, PhoneType, Address (src/database/entities/).
- Validación: class-validator en DTOs; ValidationPipe global en main.ts.

---

[README principal](../../README.md)
