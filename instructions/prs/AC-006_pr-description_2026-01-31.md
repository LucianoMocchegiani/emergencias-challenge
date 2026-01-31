# feat(swagger): Documentación OpenAPI/Swagger de todos los endpoints

## Resumen

Se configuró Swagger (@nestjs/swagger) para documentar toda la API: Swagger UI disponible en `/swagger`, tags Contacts y Activities, decoradores en controladores (ContactsController y ActivitiesController) y en DTOs (@ApiProperty/@ApiPropertyOptional) para que el esquema de request sea visible y probables desde "Try it out".

## Motivación

AC-006 exige documentar todos los endpoints de contactos y actividades con Swagger. Sin esto no hay documentación interactiva de la API; AC-007 cubrirá tests y linter.

## Criterios de Aceptación

- [x] Al arrancar la app, Swagger UI está disponible en la ruta configurada (http://localhost:3000/swagger).
- [x] Todos los endpoints de contactos y actividades aparecen agrupados por tag (Contacts, Activities).
- [x] Cada endpoint tiene descripción (summary), parámetros/body y respuestas documentadas (200, 201, 400, 404, 409, 204 según corresponda).
- [x] Los DTOs de request aparecen en el esquema y se pueden usar en "Try it out" de Swagger UI.
- [x] No hay errores de compilación ni warnings relevantes de Swagger.

## Cambios Técnicos

### Backend (Node.js/TypeScript)

- **main.ts:** DocumentBuilder con título "Agenda de Contactos API", descripción, versión 1.0, tags 'Contacts' y 'Activities'. SwaggerModule.setup('api', app, document).
- **ContactsController:** @ApiTags('Contacts'); en cada ruta @ApiOperation, @ApiResponse (200/201/400/404/409/204), @ApiBody para POST/PATCH, @ApiQuery para GET con query params, @ApiParam para :id.
- **Contacts DTOs:** CreateContactDto, UpdateContactDto (PartialType de @nestjs/swagger), PhoneItemDto, AddressItemDto, SearchByPhoneQueryDto con @ApiProperty/@ApiPropertyOptional y ejemplos.
- **ActivitiesController:** @ApiTags('Activities'); POST con @ApiOperation, @ApiBody(CreateActivityDto), @ApiResponse(201/400/404); GET con @ApiOperation, @ApiQuery(personId, activityType), @ApiResponse(200/400/404).
- **CreateActivityDto:** @ApiProperty en personId, activityType (enum), activityDate; @ApiPropertyOptional en description.

### API / Rutas

- Sin nuevas rutas; solo documentación. Todas las rutas existentes (contacts y activities) quedan documentadas en Swagger UI en /swagger.

### Tests / Documentación

- Sin tests automatizados en este PR.
- README de contactos y actividades ya existían; Swagger complementa la documentación interactiva.

## Testing

- Verificación manual: npm run start:dev; abrir http://localhost:3000/swagger y comprobar que aparecen todos los endpoints agrupados por tag y que "Try it out" permite enviar requests con los DTOs documentados.

## Screenshots/Demo

No aplica (documentación en /swagger).

## Referencias

- Ticket: AC-006
- Plan de acción: instructions/tasks/AC-006-action-plan_2026-01-31_18-52-46.md

## Deployment

### Cambios Requeridos

- [x] Nueva dependencia: @nestjs/swagger (npm install).
- [ ] No migraciones.
- [ ] No nuevas variables de entorno.
- [ ] Reiniciar servidor: npm run start:dev o build + start:prod.

### Verificación Post-Deployment

- [ ] http://localhost:3000/swagger muestra Swagger UI con tags Contacts y Activities.
- [ ] Cada endpoint muestra summary, parámetros/body y respuestas.
- [ ] "Try it out" en POST /contacts o POST /activities muestra el esquema del DTO.

## Riesgos y Plan de Rollback

- Solo se añade documentación; no cambia lógica de negocio. Rollback: revertir commits de AC-006 si hubiera conflictos con dependencias.

## Notas Adicionales

- UpdateContactDto usa PartialType de @nestjs/swagger (no @nestjs/mapped-types) para heredar el esquema de CreateContactDto en Swagger.
