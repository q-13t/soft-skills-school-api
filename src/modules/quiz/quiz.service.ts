import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Test as TestDB } from 'src/database/models/test.schema';
import {
  Question,
  QuestionLeanDocument,
} from 'src/database/models/question.schema';
import { CreateTestDto } from './dto/quiz.dto';
import { Test } from 'src/types/test.type';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(TestDB.name) private readonly testModel: Model<TestDB>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionLeanDocument>,
    private readonly logger: LoggerService,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const { questions, created_by, status, timer } = createTestDto;

    const questionIds: any[] = questions;

    const fetchedQuestions = await this.findQuestionById(questionIds);

    const test = new this.testModel(createTestDto);
    test.questions = fetchedQuestions;
    test.created_at = new Date();
    test.created_by = created_by;
    test.status = status;
    test.timer = timer;

    const newTest = await test.save();

    this.logger.info('Created test:', newTest);

    return newTest;
  }

  async findQuestionById(
    questionIds: ObjectId[],
  ): Promise<QuestionLeanDocument[]> {
    const fetchedQuestions = await this.questionModel.find({
      _id: { $in: questionIds },
    });

    if (fetchedQuestions.length === 0) {
      this.logger.error('Questions not found');
      throw new HttpException('Questions not found', HttpStatus.NOT_FOUND);
    }

    const result = fetchedQuestions.map((questionId, index) => {
      const {
        _id,
        type,
        question,
        answers,
        correctAnswers,
        characteristics,
        created_at,
      } = questionId;

      return {
        questionId: _id,
        _id,
        type,
        question,
        answers,
        correctAnswers,
        characteristics,
        created_at,
      };
    });

    return result;
  }

  async getAll(): Promise<Test[]> {
    const fetchedTests = await this.testModel.find({});

    if (fetchedTests.length === 0) {
      this.logger.error('Tests not found');
      throw new HttpException('Tests not found', HttpStatus.NOT_FOUND);
    }

    return fetchedTests;
  }

  async get(testId: findByIdDto): Promise<Test> {
    const { id } = testId;

    const fetchedTest = await this.testModel.findById(id);

    this.logger.info('Fetched test:', fetchedTest);

    if (!fetchedTest) {
      this.logger.error('Test not found');
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }

    return fetchedTest;
  }

  async delete(testId: deleteByIdDto): Promise<Test> {
    const { id } = testId;

    const deletedTest = await this.testModel.findByIdAndDelete(id);

    this.logger.info('Deleted test:', deletedTest);

    if (!deletedTest) {
      this.logger.error('Test not found');
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }

    return deletedTest;
  }
}
