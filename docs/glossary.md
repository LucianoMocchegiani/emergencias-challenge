# Glosario

Términos del dominio y de la arquitectura usados en la documentación del proyecto.

## Dominio

- **Person (Contacto)** – Entidad principal de la agenda. Tiene nombre, apellido, fecha de nacimiento, email y puede tener varios teléfonos y varias direcciones asociados.

- **Phone (Teléfono)** – Número de teléfono asociado a un contacto. Pertenece a un tipo (PhoneType) y a una Person.

- **PhoneType (Tipo de teléfono)** – Clasificación del teléfono: por ejemplo móvil, casa, trabajo. La tabla se puede poblar con un seed; los contactos referencian el id del tipo al crear o editar teléfonos.

- **Address (Dirección)** – Dirección postal asociada a un contacto (localidad, calle, número, notas opcionales).

- **ContactActivity (Actividad de contacto)** – Registro de una actividad realizada por o sobre un contacto: llamada (call), reunión (meeting) o email (email). Incluye fecha/hora y descripción opcional.

## API y arquitectura

- **DTO (Data Transfer Object)** – Objeto de transferencia de datos: clase usada para validar y tipar la entrada (body o query params) de un endpoint. En este proyecto se definen con class-validator y se usan con ValidationPipe.

- **Módulo (NestJS)** – Unidad de organización del backend que agrupa controladores, servicios y dependencias (p. ej. TypeORM) para un conjunto de funcionalidades (contactos, actividades).

- **Swagger** – Herramienta de documentación de la API (OpenAPI). En este proyecto la documentación se genera desde decoradores en controladores y DTOs y se expone en la ruta `/swagger`.

- **ADR (Architecture Decision Record)** – Registro de una decisión arquitectónica: contexto, decisión y consecuencias. En este proyecto se guardan en `docs/adr/`.

---

[README principal](../README.md)
