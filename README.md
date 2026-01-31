# Backend Challenge - Agenda de Contactos

API RESTful para una **agenda de contactos**: cada contacto puede tener varios teléfonos (con tipo) y varias direcciones, más un registro de actividades (llamadas, reuniones, emails). Desarrollado con **NestJS**, **TypeScript** y **SQLite**.

La especificación completa del challenge está en [docs/objetivo.md](docs/objetivo.md).

---

## Stack técnico

| Tecnología | Uso |
|------------|-----|
| **NestJS** | Framework backend (Node.js + TypeScript) |
| **TypeScript** | Lenguaje del proyecto, tipado estricto |
| **SQLite** | Base de datos |
| **Swagger** (@nestjs/swagger) | Documentación de la API |
| **class-validator** / **class-transformer** | Validación de DTOs |
| **Jest** | Tests unitarios |
| **ESLint** | Linter |
| **Git** | Control de versiones |

---

## Por qué se eligió este stack

### NestJS

- **Arquitectura y patrones**: El challenge pide evaluar arquitectura y patrones de diseño. NestJS aporta módulos, controladores, servicios e inyección de dependencias de forma clara, sin tener que inventar la estructura.
- **TypeScript nativo**: Todo el código debe estar en TypeScript; NestJS está pensado para TypeScript desde el inicio.
- **API REST**: Decoradores (`@Get`, `@Post`, `Put`, `Delete`), manejo de errores y status codes se integran bien con los requisitos de verbos HTTP y respuestas correctas.
- **Validación**: Integración con class-validator en DTOs para validar entrada sin añadir capas manuales.
- **Tamaño del problema**: Una API de contactos, teléfonos, direcciones y actividades encaja en unos pocos módulos (contacts, activities, phones, addresses), sin que el framework resulte excesivo.

### Swagger

- **Documentación de la API**: El challenge lo menciona como plus (por ejemplo con Swagger). Con `@nestjs/swagger` la documentación se genera a partir de decoradores en controladores y DTOs.
- **Menos mantenimiento**: La documentación acompaña al código; no hace falta mantener un documento aparte.
- **Útil para quien evalúa**: Quien revise el challenge puede probar los endpoints desde la UI de Swagger.

### SQLite

- Indicado en la especificación: Node.js + TypeScript + SQLite + Git.
- Se puede usar con TypeORM, Prisma o un módulo propio (better-sqlite3) según preferencia.

---

## Estructura del proyecto

```
Emergencias Challenge/
├── README.md           # Este archivo
├── docs/
│   └── objetivo.md     # Especificación del challenge
├── instructions/       # Reglas de desarrollo, tickets, planes, PRs
├── src/                # Código NestJS (cuando exista)
│   ├── main.ts
│   ├── app.module.ts
│   ├── contacts/
│   ├── activities/
│   ├── phones/
│   ├── addresses/
│   └── ...
└── database/           # Schema SQLite, migraciones (cuando exista)
```

---

## Cómo empezar

(Se completará cuando exista el código NestJS.)

```bash
# Instalar dependencias
npm install

# Base de datos (crear/ejecutar schema SQLite si aplica)
# ...

# Desarrollo
npm run start:dev

# Documentación API
# Swagger disponible en http://localhost:3000/swagger
```

---

## Documentación

- [Objetivo del challenge](docs/objetivo.md) - Especificación, operaciones requeridas y criterios de evaluación
- [Instructions](instructions/README.md) - Reglas de Cursor, tickets, planes de acción y PRs
- [NestJS](https://docs.nestjs.com/)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)

---

## Convenciones

- **Tickets**: Prefijo `AC-XXX` (Agenda de Contactos)
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- **READMEs**: Tono profesional, sin emojis
