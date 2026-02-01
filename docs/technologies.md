# Tecnologías utilizadas

Stack del proyecto Backend Challenge (agenda de contactos). La justificación detallada (pros y contras de cada elección) está en [ADR 0001 – Stack inicial](adr/0001-stack-inicial.md).

## Resumen por categoría

| Tecnología | Uso |
|------------|-----|
| **Node.js** | Entorno de ejecución |
| **TypeScript** | Lenguaje del proyecto, tipado estricto |
| **NestJS** | Framework backend (módulos, controladores, servicios) |
| **SQLite** | Base de datos (archivo único, sin servidor) |
| **TypeORM** | ORM (entidades, repositorios, relaciones) |
| **Swagger** (@nestjs/swagger) | Documentación de la API (OpenAPI, UI en `/swagger`) |
| **class-validator** / **class-transformer** | Validación de DTOs (ValidationPipe global) |
| **Jest** | Tests unitarios (TestingModule, mocks) |
| **ESLint** | Linter (estilo y reglas TypeScript) |
| **Git** | Control de versiones |

Para el **por qué** de cada tecnología y sus consecuencias (pros y contras), ver [ADR 0001 – Stack inicial](adr/0001-stack-inicial.md).

---

[README principal](../README.md)
