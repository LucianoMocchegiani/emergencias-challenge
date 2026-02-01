# Backend Challenge - Agenda de Contactos

API RESTful para una **agenda de contactos**: cada contacto puede tener varios teléfonos (con tipo) y varias direcciones, más un registro de actividades (llamadas, reuniones, emails).

**Stack:** NestJS, TypeScript, SQLite, TypeORM, Swagger, class-validator, Jest, ESLint. Detalle y justificación en [Tecnologías](docs/technologies.md). Especificación del challenge en [docs/objetivo.md](docs/objetivo.md).

---

## Cómo empezar

```bash
npm install
npm run seed   # opcional: tipos de teléfono (1 móvil, 2 casa, 3 trabajo)
npm run start:dev
```

- Base de datos: SQLite en `data/contacts.db`; se crea al arrancar (TypeORM synchronize).
- Swagger: http://localhost:3000/swagger (con la app en marcha).
- Contactos con teléfonos requieren `phoneTypeId` existente en `phone_type` (seed o manual).
- **Variables de entorno:** Opcional. El código usa valores por defecto (puerto 3000, BD en `./data/contacts.db`). Si quieres sobrescribirlos, copia [.env.example](.env.example) a `.env` y ajusta `DATABASE_PATH`, `PORT` o `NODE_ENV`.

---

## Estructura

```
Emergencias Challenge/
├── README.md                 # Este archivo (punto de entrada)
├── docs/                     # Documentación técnica y de diseño
│   ├── objetivo.md           # Especificación del challenge
│   ├── database.md           # Diagrama ER (Mermaid e imagen)
│   ├── architecture.md       # Arquitectura del backend
│   ├── technologies.md       # Stack y justificación
│   ├── patterns.md           # Patrones utilizados
│   ├── glossary.md           # Glosario de términos
│   └── adr/                  # Decisiones arquitectónicas
│       ├── README.md
│       └── 0001-stack-inicial.md
├── instructions/             # Reglas de Cursor, tickets, planes, PRs
│   ├── README.md
│   ├── tasks/                # Planes de acción
│   ├── prs/                  # Descripciones de PR
│   └── tickets/              # Tickets de trabajo
├── src/                      # Código NestJS
│   ├── main.ts
│   ├── app.module.ts
│   ├── contacts/             # Módulo contactos
│   │   ├── README.md
│   │   ├── contacts.controller.ts
│   │   ├── contacts.service.ts
│   │   └── dto/
│   ├── activities/           # Módulo actividades
│   │   ├── README.md
│   │   ├── activities.controller.ts
│   │   ├── activities.service.ts
│   │   └── dto/
│   └── database/
│       ├── entities/         # Entidades TypeORM
│       └── seed.ts           # Seed de tipos de teléfono
├── data/                     # SQLite (contacts.db, creado al arrancar)
├── .env.example               # Variables de entorno de ejemplo (opcional; hay valores por defecto)
├── test/                     # Tests e2e
├── package.json
└── tsconfig.json
```

---

**Objetivo del challenge.** Especificación, operaciones requeridas, esquema de BD y criterios de evaluación: [docs/objetivo.md](docs/objetivo.md).

**Diagrama de base de datos.** Esquema ER (Person, Phone, PhoneType, Address, ContactActivity) en Mermaid e imagen: [docs/database.md](docs/database.md).

**Arquitectura.** Descripción de capas (API, servicios, persistencia), módulos y flujo de una petición: [docs/architecture.md](docs/architecture.md).

**Tecnologías.** Stack utilizado y justificación de cada elección: [docs/technologies.md](docs/technologies.md).

**Patrones.** Patrones de diseño y arquitectura aplicados y su motivación: [docs/patterns.md](docs/patterns.md).

**Instructions.** Reglas de Cursor, tickets, planes de acción y descripciones de PR: [instructions/README.md](instructions/README.md).

**Módulo Contacts.** Endpoints y DTOs de contactos, teléfonos y direcciones: [src/contacts/README.md](src/contacts/README.md).

**Módulo Activities.** Creación y búsqueda de actividades por contacto y tipo: [src/activities/README.md](src/activities/README.md).

---

## Convenciones

- **Tickets**: Prefijo `AC-XXX` (Agenda de Contactos)
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
