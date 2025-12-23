import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Question as QuestionDB,
  QuestionDocument,
} from 'src/database/models/question.schema';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { CharacteristicWithSoftSkill, Question } from 'src/types/question.type';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { UpdateByIdDto } from 'src/common/dto/updateById.dto';
import { Characteristic as CharacteristicDB } from 'src/database/models/characteristic.schema';
import { Types } from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(QuestionDB.name)
    private readonly questionModel: Model<QuestionDB>,
    @InjectModel(CharacteristicDB.name)
    private readonly characteristicModel: Model<CharacteristicDB>,
    private readonly logger: LoggerService,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDocument> {
    const { characteristics } = createQuestionDto;

    const characteristicIds = characteristics.map(
      (characteristicId) =>
        new Types.ObjectId(characteristicId?.characteristicId as any),
    );

    const characteristicPoints: number[] = characteristics.map(
      (characteristic) => characteristic?.points,
    );

    const fetchedCharacteristics = await this.findCharacteristicsById(
      characteristicIds,
      characteristicPoints,
    );

    const question = new this.questionModel(createQuestionDto);
    question.characteristics = fetchedCharacteristics;
    question.created_at = new Date();

    const newQuestion = await question.save();

    this.logger.info('Created question:', newQuestion);

    return newQuestion;
  }

  async findCharacteristicsById(
    characteristicIds: Types.ObjectId[],
    characteristicPoints: number[],
  ): Promise<CharacteristicWithSoftSkill[]> {
    const fetchedCharacteristics = await this.characteristicModel.find({
      _id: { $in: characteristicIds },
    });

    if (fetchedCharacteristics.length === 0) {
      this.logger.error('Characteristics not found');
      throw new HttpException(
        'Characteristics not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const fetchedCharacteristicsMap = fetchedCharacteristics.reduce(
      (acc, curr) => ({ ...acc, [curr._id.toString()]: curr }),
      {},
    );
    const result = characteristicIds.map((id, index) => {
      const characteristic = fetchedCharacteristicsMap[id.toString()];
      const { _id, title, softSkill, created_at } = characteristic;

      const points = characteristicPoints[index];

      return {
        characteristicId: _id,
        title,
        points,
        softSkill: {
          softSkillId: softSkill?.softSkillId ?? null,
          type: softSkill?.type ?? null,
        },
        created_at,
      };
    });

    return result;
  }

  async getAll(): Promise<Question[]> {
    const fetchedQuestions = await this.questionModel.find({});

    if (fetchedQuestions.length === 0) {
      this.logger.error('Items not found');
      throw new HttpException('Items not found', HttpStatus.NOT_FOUND);
    }

    return fetchedQuestions;
  }

  async get(questionId: findByIdDto): Promise<Question> {
    const { id } = questionId;

    const fetchedQuestion = await this.questionModel.findById(id);

    this.logger.info('Fetched question:', fetchedQuestion);

    if (!fetchedQuestion) {
      this.logger.error('Question not found');
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return fetchedQuestion;
  }

  async delete(questionId: deleteByIdDto): Promise<Question> {
    const { id } = questionId;

    const deletedQuestion = await this.questionModel.findByIdAndDelete(id);

    this.logger.info('Deleted user:', deletedQuestion);

    if (!deletedQuestion) {
      this.logger.error('Question not found');
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return deletedQuestion;
  }

  async update(
    questionId: UpdateByIdDto,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const { id } = questionId;

    const updatedQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      updateQuestionDto,
      { new: true },
    );

    if (!updatedQuestion) {
      this.logger.error('Question not found');
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return updatedQuestion;
  }
}
