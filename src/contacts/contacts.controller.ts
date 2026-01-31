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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchByPhoneQueryDto } from './dto/search-by-phone-query.dto';
import type { FindByPersonalDataFilters } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() dto: CreateContactDto) {
    const contact = await this.contactsService.create(dto);
    return contact;
  }

  @Get('email')
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactsService.remove(id);
  }
}
