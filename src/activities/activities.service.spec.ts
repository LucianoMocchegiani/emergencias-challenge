import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ContactActivity } from '../database/entities/contact-activity.entity';
import { Person } from '../database/entities/person.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let personRepo: { findOne: jest.Mock };

  const mockActivityRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockPersonRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(ContactActivity),
          useValue: mockActivityRepo,
        },
        { provide: getRepositoryToken(Person), useValue: mockPersonRepo },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    personRepo = mockPersonRepo;
  });

  describe('create', () => {
    const validDto: CreateActivityDto = {
      personId: 1,
      activityType: 'call',
      activityDate: '2025-01-15T10:00:00Z',
      description: 'Llamada de seguimiento',
    };

    it('should create an activity when personId exists', async () => {
      const person = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        dateOfBirth: '1990-01-01',
      };
      personRepo.findOne.mockResolvedValue(person);
      const savedActivity = {
        id: 1,
        personId: 1,
        activityType: 'call',
        activityDate: validDto.activityDate,
        description: validDto.description,
      };
      mockActivityRepo.create.mockReturnValue(savedActivity);
      mockActivityRepo.save.mockResolvedValue(savedActivity);

      const result = await service.create(validDto);

      expect(personRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockActivityRepo.create).toHaveBeenCalled();
      expect(mockActivityRepo.save).toHaveBeenCalled();
      expect(result).toEqual(savedActivity);
    });

    it('should throw NotFoundException when personId does not exist', async () => {
      personRepo.findOne.mockResolvedValue(null);

      const promise = service.create(validDto);
      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toThrow('Contacto no encontrado');
      expect(mockActivityRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findByContactAndType', () => {
    it('should return contact and activities when person exists', async () => {
      const person = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        dateOfBirth: '1990-01-01',
      };
      personRepo.findOne.mockResolvedValue(person);
      const activities = [
        {
          id: 1,
          personId: 1,
          activityType: 'call',
          activityDate: '2025-01-15T10:00:00Z',
          description: 'Llamada',
        },
      ];
      mockActivityRepo.find.mockResolvedValue(activities);

      const result = await service.findByContactAndType(1, 'call');

      expect(personRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockActivityRepo.find).toHaveBeenCalledWith({
        where: { personId: 1, activityType: 'call' },
        order: { activityDate: 'ASC' },
      });
      expect(result).toEqual({
        contact: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          dateOfBirth: '1990-01-01',
        },
        activities,
      });
    });

    it('should return empty activities array when person exists but has no activities', async () => {
      const person = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        dateOfBirth: null,
      };
      personRepo.findOne.mockResolvedValue(person);
      mockActivityRepo.find.mockResolvedValue([]);

      const result = await service.findByContactAndType(1, 'meeting');

      expect(result.contact).toEqual({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        dateOfBirth: null,
      });
      expect(result.activities).toEqual([]);
    });

    it('should throw NotFoundException when personId does not exist', async () => {
      personRepo.findOne.mockResolvedValue(null);

      const promise = service.findByContactAndType(999, 'call');
      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toThrow('Contacto no encontrado');
    });
  });
});
