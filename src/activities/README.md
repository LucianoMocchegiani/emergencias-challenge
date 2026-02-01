# Módulo Activities

Módulo de la API que expone la creación de actividades de contacto y la búsqueda de actividades por contacto y tipo. Las actividades se asocian a un contacto (Person) y tienen tipo `call`, `meeting` o `email`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /activities | Crear actividad (201 Created, 400 si validación falla, 404 si personId no existe) |
| GET | /activities?personId=&activityType= | Búsqueda por contacto y tipo (200 con { contact, activities }; 404 si contacto no existe; 400 si faltan params o activityType inválido) |

## Crear actividad (POST /activities)

**Body (JSON):**

- `personId` (number, requerido): ID del contacto al que se asocia la actividad.
- `activityType` (string, requerido): uno de `'call'`, `'meeting'`, `'email'`.
- `activityDate` (string, requerido): fecha de la actividad (texto, p. ej. ISO).
- `description` (string, opcional): descripción de la actividad.

Ejemplo:

```json
{
  "personId": 1,
  "activityType": "call",
  "activityDate": "2026-01-31T10:00:00.000Z",
  "description": "Llamada de seguimiento"
}
```

**Respuesta:** 201 con la actividad creada (id, personId, activityType, activityDate, description).  
**Errores:** 400 si validación falla (activityType distinto de call/meeting/email, campos requeridos vacíos); 404 si el contacto (personId) no existe.

## Búsqueda por contacto y tipo (GET /activities)

**Query params (obligatorios):**

- `personId` (number): ID del contacto.
- `activityType` (string): uno de `call`, `meeting`, `email`.

Ejemplo: `GET /activities?personId=1&activityType=call`

**Respuesta:** 200 con un objeto:

```json
{
  "contact": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "dateOfBirth": "1990-05-15"
  },
  "activities": [
    {
      "id": 1,
      "personId": 1,
      "activityType": "call",
      "activityDate": "2026-01-31T10:00:00.000Z",
      "description": "Llamada de seguimiento"
    }
  ]
}
```

Si no hay actividades para ese contacto y tipo, `activities` es un array vacío `[]`.  
**Errores:** 400 si falta personId o activityType, si activityType no es call/meeting/email o si personId no es un número; 404 si el contacto no existe.

## Estructura

- `activities.module.ts` – Módulo NestJS; TypeOrmModule.forFeature([ContactActivity, Person]).
- `activities.controller.ts` – POST /activities, GET /activities (query params).
- `activities.service.ts` – create, findByContactAndType; lógica de negocio y acceso a ContactActivity y Person.
- `dto/create-activity.dto.ts` – DTO para creación (personId, activityType, activityDate, description opcional) con class-validator.

## Dependencias

- Entidades: ContactActivity, Person (src/database/entities/).
- Validación: class-validator + class-transformer; ValidationPipe global en main.ts.

---

[README principal](../../README.md)
