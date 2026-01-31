# Módulo Contacts

Módulo de la API que expone las operaciones CRUD sobre contactos (entidad Person).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /contacts | Crear contacto (201 Created, 400 si validación falla, 409 si email duplicado) |
| GET | /contacts/email?email= | Búsqueda por email (200 o 404) |
| GET | /contacts | Búsqueda por datos personales (query params opcionales: firstName, lastName, dateOfBirth, email); 200 con lista |
| GET | /contacts/:id | Obtener contacto por id (200 o 404) |
| PATCH | /contacts/:id | Editar datos personales (200, 404 o 400) |
| DELETE | /contacts/:id | Eliminar contacto (204 No Content, 404 si no existe) |

## Estructura

- `contacts.module.ts` – Módulo NestJS; importa TypeOrmModule.forFeature([Person]).
- `contacts.controller.ts` – Rutas REST.
- `contacts.service.ts` – Lógica de negocio y acceso a Person (TypeORM).
- `dto/create-contact.dto.ts` – DTO base para creación (class-validator).
- `dto/update-contact.dto.ts` – DTO para actualización parcial; extiende `PartialType(CreateContactDto)` (@nestjs/mapped-types).

## Dependencias

- Entidad: `Person` (src/database/entities/person.entity.ts).
- Validación: class-validator en DTOs; ValidationPipe global en main.ts.
