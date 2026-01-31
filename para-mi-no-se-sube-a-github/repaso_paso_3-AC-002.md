# Repaso Paso 3 – AC-002: Entidad Person

## Qué se hizo

Se creó la entidad TypeORM **Person** según `docs/objetivo.md`: tabla `person` con columnas id (PK, auto increment), firstName, lastName, dateOfBirth y email. La entidad está en una carpeta compartida para el schema (`src/database/entities/`).

---

## Archivos creados

| Archivo | Acción |
|--------|--------|
| `src/database/entities/person.entity.ts` | Creado: entidad Person con decoradores TypeORM |

No se modificó `app.module.ts`: TypeORM ya carga todas las entidades con el glob `**/*.entity{.ts,.js}` configurado en el Paso 2.

---

## Entidad Person – columnas

| Columna      | Tipo TypeORM | Tipo SQLite | Nullable | Descripción                    |
|-------------|--------------|-------------|----------|--------------------------------|
| **id**      | number       | INTEGER PK  | No       | PK, auto increment             |
| **firstName** | string     | TEXT        | No       | Nombre                         |
| **lastName**  | string     | TEXT        | No       | Apellido                       |
| **dateOfBirth** | string   | TEXT        | Sí       | Fecha de nacimiento (ej. ISO)  |
| **email**   | string       | TEXT        | No       | Email del contacto             |

---

## Decoradores usados

- **@Entity('person')** – Nombre de la tabla en la base de datos.
- **@PrimaryGeneratedColumn()** – id numérico autoincremental.
- **@Column({ type: 'text' })** – Columnas de texto; `nullable: true` solo en dateOfBirth.

---

## Por qué TEXT y no VARCHAR (firstName, lastName, email, dateOfBirth)

En **SQLite** el tipo `VARCHAR(n)` no aplica ningún límite de longitud: la columna tiene afinidad TEXT y la base de datos no valida el número de caracteres. Usar `VARCHAR(255)` solo documentaría la intención; en SQLite es metadata, no restricción.

Por eso en Person se dejó **`type: 'text'`** en todas las columnas de texto (firstName, lastName, dateOfBirth, email): mismo resultado práctico en SQLite y menos ruido. Si en el futuro se migrara a PostgreSQL o MySQL, ahí sí tendría sentido definir longitudes (varchar) para que la BD las aplique.

---

## Relaciones (para pasos siguientes)

En el objetivo, **Person** tiene:

- One-to-Many con **Phone** (personId en Phone).
- One-to-Many con **Address** (personId en Address).
- One-to-Many con **ContactActivities** (personId en ContactActivities).

Estas relaciones se pueden añadir en Person (OneToMany) cuando existan las entidades Phone, Address y ContactActivities en los Pasos 4–6.

---

## Resumen

- **Un archivo nuevo:** `src/database/entities/person.entity.ts`.
- **Tabla en SQLite:** `person` con id, firstName, lastName, dateOfBirth, email.
- **Detección:** TypeORM la incluye por el glob de entidades; con `synchronize: true` la tabla se crea al arrancar la app.
