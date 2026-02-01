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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchByPhoneQueryDto } from './dto/search-by-phone-query.dto';
import { FindByEmailQueryDto } from './dto/find-by-email-query.dto';
import { FindByPersonalDataQueryDto } from './dto/find-by-personal-data-query.dto';

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
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 400, description: 'Formato de email inválido' })
  async findOneByEmail(@Query() query: FindByEmailQueryDto) {
    const contact = await this.contactsService.findByEmail(query.email.trim());
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Get('by-phone')
  @ApiOperation({ summary: 'Búsqueda por número y tipo de teléfono' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o tipo inexistente',
  })
  async findByPhoneAndType(@Query() query: SearchByPhoneQueryDto) {
    const contact = await this.contactsService.findContactByPhoneNumberAndType(
      query.number,
      query.phoneTypeId,
    );
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Get()
  @ApiOperation({
    summary: 'Búsqueda por datos personales (filtros opcionales)',
  })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  @ApiResponse({ status: 400, description: 'Formato de filtros inválido' })
  async findAll(@Query() query: FindByPersonalDataQueryDto) {
    return this.contactsService.findByPersonalData(query);
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
