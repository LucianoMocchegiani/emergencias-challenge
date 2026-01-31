import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchByPhoneQueryDto } from './dto/search-by-phone-query.dto';
import type { FindByPersonalDataFilters } from './contacts.service';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear contacto' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'Contacto creado' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async create(@Body() dto: CreateContactDto) {
    const contact = await this.contactsService.create(dto);
    return contact;
  }

  @Get('email')
  @ApiOperation({ summary: 'Búsqueda por email' })
  @ApiQuery({ name: 'email', required: true, description: 'Email del contacto' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 400, description: 'Email vacío o faltante' })
  async findOneByEmail(@Query('email') email: string) {
    if (!email || email.trim() === '') {
      throw new BadRequestException('El query param email es requerido');
    }
    const contact = await this.contactsService.findByEmail(email.trim());
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Get('by-phone')
  @ApiOperation({ summary: 'Búsqueda por número y tipo de teléfono' })
  @ApiQuery({ name: 'number', required: true, description: 'Número de teléfono' })
  @ApiQuery({ name: 'phoneTypeId', required: false, type: Number, description: 'ID del tipo de teléfono' })
  @ApiQuery({ name: 'typeName', required: false, description: 'Nombre del tipo (alternativa a phoneTypeId)' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos o tipo inexistente' })
  async findByPhoneAndType(@Query() query: SearchByPhoneQueryDto) {
    const hasId = query.phoneTypeId !== undefined && query.phoneTypeId !== null;
    const hasName =
      query.typeName !== undefined && query.typeName !== null && String(query.typeName).trim() !== '';
    if (!hasId && !hasName) {
      throw new BadRequestException('Debe proporcionar phoneTypeId o typeName');
    }
    const contact = await this.contactsService.findContactByPhoneNumberAndType(
      query.number,
      query.phoneTypeId,
      query.typeName,
    );
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Get()
  @ApiOperation({ summary: 'Búsqueda por datos personales (filtros opcionales)' })
  @ApiQuery({ name: 'firstName', required: false })
  @ApiQuery({ name: 'lastName', required: false })
  @ApiQuery({ name: 'dateOfBirth', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  async findAll(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('dateOfBirth') dateOfBirth?: string,
    @Query('email') email?: string,
  ) {
    const filters: FindByPersonalDataFilters = {
      firstName,
      lastName,
      dateOfBirth,
      email,
    };
    return this.contactsService.findByPersonalData(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener contacto por id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del contacto' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar contacto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del contacto' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'Contacto actualizado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar contacto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del contacto' })
  @ApiResponse({ status: 204, description: 'Contacto eliminado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactsService.remove(id);
  }
}
