# Patrones utilizados

Patrones de diseño y arquitectura aplicados en el proyecto y su motivación.

## Módulos por dominio (recurso)

**Qué se hace:** El backend se organiza en módulos NestJS por recurso: `ContactsModule` (contactos, teléfonos, direcciones) y `ActivitiesModule` (actividades de contacto). Cada módulo agrupa controlador, servicio, DTOs y dependencias de TypeORM para sus entidades.

**Por qué:** Separa responsabilidades por dominio; facilita encontrar y modificar código relacionado con contactos o actividades. Escala bien si se añaden más recursos (p. ej. módulo de reportes). Alinea con la evaluación de arquitectura del challenge.

## Inyección de dependencias

**Qué se hace:** Los controladores reciben el servicio en el constructor (`private readonly contactsService: ContactsService`). Los servicios reciben los repositorios de TypeORM en el constructor. NestJS resuelve las dependencias automáticamente.

**Por qué:** Desacopla controladores de implementaciones concretas de servicios y de acceso a datos. Facilita tests unitarios (inyección de mocks). Patrón estándar en NestJS.

## DTOs y validación en capa de entrada

**Qué se hace:** Cada endpoint que recibe body o query params usa un DTO de clase (CreateContactDto, FindByEmailQueryDto, SearchByPhoneQueryDto, etc.) con decoradores de class-validator (@IsEmail(), @Matches(), @IsOptional(), etc.). El ValidationPipe global valida antes de que la petición llegue al controlador; si falla, responde 400 con mensajes por campo.

**Por qué:** Validación declarativa y centralizada; no hace falta comprobar manualmente en cada controlador. Respuestas 400 consistentes y mensajes claros para el cliente. Reduce superficie de datos inválidos en servicios.

## Capa de servicios (lógica de negocio)

**Qué se hace:** Los controladores son finos: reciben la petición, llaman al servicio y devuelven la respuesta. Toda la lógica de negocio (validar que un phoneTypeId exista antes de crear contacto, buscar por email, por número y tipo, crear actividades, etc.) está en los servicios.

**Por qué:** Controladores fáciles de leer y de testear. Lógica reutilizable entre endpoints. Facilita cambiar reglas de negocio sin tocar rutas HTTP.

## Abstracción de persistencia (TypeORM)

**Qué se hace:** Los servicios no escriben SQL; usan repositorios de TypeORM (findOne, find, save, createQueryBuilder, etc.) sobre entidades tipadas. Las entidades reflejan el esquema de BD (Person, Phone, PhoneType, Address, ContactActivity).

**Por qué:** Código tipado y menos propenso a errores; consultas parametrizadas (TypeORM) reducen riesgo de inyección SQL. Cambios de esquema se reflejan en entidades; para el challenge no se usa capa de repositorio propia adicional.

## Excepciones HTTP como contrato de error

**Qué se hace:** Los servicios lanzan excepciones de NestJS (NotFoundException, ConflictException, BadRequestException) cuando el flujo no puede continuar. NestJS las traduce en respuestas HTTP (404, 409, 400) con formato JSON estándar.

**Por qué:** Contrato claro entre servicio y API: el controlador no decide códigos de estado para errores de negocio; el servicio indica “no encontrado”, “conflicto” o “petición inválida” y el framework responde en consecuencia. Consistencia en respuestas de error.

## Documentación junto al código (Swagger)

**Qué se hace:** Los controladores y DTOs llevan decoradores de @nestjs/swagger (@ApiTags, @ApiOperation, @ApiResponse, @ApiBody, @ApiQuery, @ApiProperty). La documentación OpenAPI se genera a partir de ellos y se sirve en `/swagger`.

**Por qué:** La documentación de la API acompaña al código; no hace falta mantener un documento aparte. Quien evalúa o usa la API puede probar endpoints desde la UI de Swagger.

---

[README principal](../README.md)
