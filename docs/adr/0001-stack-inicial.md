# ADR 0001 – Stack inicial

## Contexto

Se necesita una API RESTful para una agenda de contactos: verbos HTTP correctos, status codes apropiados, documentación de API, tests y linter para mantener calidad de código.

## Decisión

- **Framework**: NestJS (Node.js + TypeScript).
- **Base de datos**: SQLite con TypeORM (entidades, repositorios, synchronize para desarrollo).
- **Documentación API**: Swagger (@nestjs/swagger) con decoradores en controladores y DTOs.
- **Validación**: class-validator y class-transformer en DTOs; ValidationPipe global.
- **Tests**: Jest (TestingModule de NestJS, mocks de repositorios).
- **Linter**: ESLint (estilo y reglas TypeScript).

## Consecuencias

**Pros:**

- NestJS: módulos, controladores, servicios e inyección de dependencias bien definidos; separación de capas clara.
- TypeScript: tipado estricto en todo el proyecto; mejor autocompletado y detección de errores en compilación.
- Swagger: documentación generada desde el código; se mantiene alineada con la API sin documentos duplicados.
- class-validator + ValidationPipe: validación declarativa en DTOs; menos lógica manual y respuestas 400 consistentes.
- SQLite: sin servidor de BD; entorno simple y portable (un solo archivo).
- TypeORM: entidades tipadas, repositorios inyectables; consultas parametrizadas y soporte SQLite.

**Contras:**

- NestJS: curva de aprendizaje si no se conoce el framework.
- TypeORM con synchronize: no recomendable en producción con migraciones complejas.
- SQLite: no escala para alto concurrencia de escritura.

---

[README principal](../../README.md)
