import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuestionService } from './question.service';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Model, Types } from 'mongoose';
import { Question } from 'src/database/models/question.schema';
import { Characteristic } from 'src/database/models/characteristic.schema';
import { HttpException } from '@nestjs/common';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionModel: Model<Question>;
  let characteristicModel: Model<Characteristic>;
  let logger: LoggerService;

  class QuestionModelMock {
    [key: string]: any;
    constructor(dto: any) {
      Object.assign(this, dto);
    }
    save = jest.fn().mockImplementation(() => Promise.resolve(this));
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getModelToken(Question.name),
          useValue: QuestionModelMock,
        },
        {
          provide: getModelToken(Characteristic.name),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionModel = module.get<Model<Question>>(getModelToken(Question.name));
    characteristicModel = module.get<Model<Characteristic>>(
      getModelToken(Characteristic.name),
    );
    logger = module.get<LoggerService>(LoggerService);
  });

  describe('create', () => {
    it('should create a question with characteristics', async () => {
      const mockDto = {
        question: 'QuestionName',
        type: 'yes_no',
        answers: ['Yes', 'No'],
        correctAnswers: [true, false],
        characteristics: [
          {
            characteristicId: '65d70497c56e967ce42b13a1',
            points: 4,
          },
          {
            characteristicId: '65d70497c56e967ce42b13a1',
            points: 3,
          },
        ],
      };

      const mockCharacteristics = [
        {
          _id: new Types.ObjectId(mockDto.characteristics[0].characteristicId),
          title: 'Leadership',
          softSkill: {
            softSkillId: 'abc123',
            type: 'Management',
          },
          created_at: new Date(),
        },
        {
          _id: new Types.ObjectId(mockDto.characteristics[1].characteristicId),
          title: 'Teamwork',
          softSkill: {
            softSkillId: 'def456',
            type: 'Collaboration',
          },
          created_at: new Date(),
        },
      ];

      const savedQuestion = {
        _id: new Types.ObjectId(),
        ...mockDto,
        characteristics: mockCharacteristics,
        created_at: new Date(),
        save: jest.fn().mockResolvedValue(this),
      };

      jest
        .spyOn(characteristicModel, 'find')
        .mockResolvedValue(mockCharacteristics as any);
      jest
        .spyOn(questionModel, 'constructor' as any)
        .mockReturnValue(savedQuestion);

      const result = await service.create(mockDto as any);

      expect(characteristicModel.find).toHaveBeenCalledWith({
        _id: {
          $in: mockDto.characteristics.map(
            (c) => new Types.ObjectId(c.characteristicId),
          ),
        },
      });

      expect(result.characteristics).toHaveLength(2);
      expect(logger.info).toHaveBeenCalledWith(
        'Created question:',
        expect.any(Object),
      );
    });

    it('should throw an error if characteristics are not found', async () => {
      const mockDto = {
        title: 'Test Question',
        characteristics: [
          { characteristicId: '60c72b2f9b1e8e1a30d1f999', points: 5 },
        ],
      };

      jest.spyOn(characteristicModel, 'find').mockResolvedValue([]);

      await expect(service.create(mockDto as any)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledWith('Characteristics not found');
    });
  });
});
