import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContactsService } from './contacts.service';
import { Person } from '../database/entities/person.entity';
import { Phone } from '../database/entities/phone.entity';
import { PhoneType } from '../database/entities/phone-type.entity';
import { Address } from '../database/entities/address.entity';
import { CreateContactDto } from './dto/create-contact.dto';

describe('ContactsService', () => {
  let service: ContactsService;
  let personRepo: jest.Mocked<
    Pick<Repository<Person>, 'findOne' | 'create' | 'save'>
  >;
  let phoneTypeRepo: jest.Mocked<Pick<Repository<PhoneType>, 'findOne'>>;

  const mockPersonRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockPhoneRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockPhoneTypeRepo = {
    findOne: jest.fn(),
  };
  const mockAddressRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: getRepositoryToken(Person), useValue: mockPersonRepo },
        { provide: getRepositoryToken(Phone), useValue: mockPhoneRepo },
        { provide: getRepositoryToken(PhoneType), useValue: mockPhoneTypeRepo },
        { provide: getRepositoryToken(Address), useValue: mockAddressRepo },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    personRepo = mockPersonRepo as unknown as typeof personRepo;
    phoneTypeRepo = mockPhoneTypeRepo as unknown as typeof phoneTypeRepo;
  });

  describe('create', () => {
    const validDto: CreateContactDto = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
    };

    it('should create a contact when DTO is valid and email is unique', async () => {
      personRepo.findOne.mockResolvedValue(null);
      const savedPerson = { id: 1, ...validDto };
      personRepo.create.mockReturnValue(savedPerson as Person);
      personRepo.save.mockResolvedValue(savedPerson as Person);

      const result = await service.create(validDto);

      expect(personRepo.findOne).toHaveBeenCalledWith({
        where: { email: validDto.email },
      });
      expect(personRepo.create).toHaveBeenCalledWith(validDto);
      expect(personRepo.save).toHaveBeenCalled();
      expect(result).toEqual(savedPerson);
    });

    it('should throw ConflictException when email already exists', async () => {
      personRepo.findOne.mockResolvedValue({
        id: 1,
        email: validDto.email,
      } as Person);

      await expect(service.create(validDto)).rejects.toThrow(ConflictException);
      await expect(service.create(validDto)).rejects.toThrow(
        'Un contacto con este email ya existe',
      );
      expect(personRepo.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when phoneTypeId does not exist', async () => {
      const dtoWithPhone: CreateContactDto = {
        ...validDto,
        phones: [{ number: '+34111222333', phoneTypeId: 999 }],
      };
      personRepo.findOne.mockResolvedValue(null);
      const createdPerson = { id: 1, ...validDto };
      personRepo.create.mockReturnValue(createdPerson as Person);
      personRepo.save.mockResolvedValue(createdPerson as Person);
      phoneTypeRepo.findOne.mockResolvedValue(null);

      const promise = service.create(dtoWithPhone);
      await expect(promise).rejects.toThrow(BadRequestException);
      await expect(promise).rejects.toThrow(
        'Tipo de teléfono con id 999 no existe',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return contact when email exists', async () => {
      const person = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      personRepo.findOne.mockResolvedValue(person as Person);

      const result = await service.findByEmail('juan@example.com');

      expect(personRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'juan@example.com' },
      });
      expect(result).toEqual(person);
    });

    it('should return null when email does not exist', async () => {
      personRepo.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('noexiste@example.com');

      expect(result).toBeNull();
    });
  });
});
