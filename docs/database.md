# Diagrama de base de datos

Modelo entidad-relación de la API de agenda de contactos. Implementado con TypeORM sobre SQLite.

## Esquema completo

Incluye las tablas del objetivo del challenge más la tabla **ContactActivities** para el registro de actividades (llamadas, reuniones, emails) por contacto.

![Diagrama ER - Base de datos](./db-diagram.png)

```mermaid
erDiagram
    Person ||--o{ Phone : "tiene"
    Person ||--o{ Address : "tiene"
    Person ||--o{ ContactActivity : "tiene"
    PhoneType ||--o{ Phone : "clasifica"

    Person {
        int id PK
        string firstName
        string lastName
        string dateOfBirth
        string email
    }

    Phone {
        int id PK
        string number
        int personId FK
        int phoneTypeId FK
    }

    PhoneType {
        int id PK
        string typeName
    }

    Address {
        int id PK
        int personId FK
        string locality
        string street
        int number
        string notes
    }

    ContactActivity {
        int id PK
        int personId FK
        string activityType
        string activityDate
        string description
    }
```

## Relaciones

| Entidad          | Relación   | Entidad          | Descripción                                      |
|------------------|------------|------------------|--------------------------------------------------|
| Person           | 1:N        | Phone            | Un contacto puede tener varios teléfonos.       |
| Person           | 1:N        | Address          | Un contacto puede tener varias direcciones.      |
| Person           | 1:N        | ContactActivity  | Un contacto puede tener muchas actividades.      |
| PhoneType        | 1:N        | Phone            | Cada teléfono tiene un tipo (móvil, casa, trabajo). |

## Tabla ContactActivities

- **activityType**: Valores permitidos `'call'`, `'meeting'`, `'email'`.
- **activityDate**: Fecha y hora de la actividad (TEXT, p. ej. ISO 8601).
- **description**: Opcional.

---

[README principal](../README.md)
