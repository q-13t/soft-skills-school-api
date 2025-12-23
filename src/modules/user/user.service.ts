import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { UpdateByIdDto } from 'src/common/dto/updateById.dto';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { User as UserDB } from 'src/database/models/user.schema';
import { User } from 'src/types/user.type';
import { AddResultsDto, UpdateUserDto } from './dto/user.dto';
import { Test } from 'src/database/models/test.schema';
import { BELBIN_TEST_ID, BelbinRole } from 'src/common/enums/belbin.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDB.name) private readonly userModel: Model<UserDB>,
    @InjectModel(Test.name) private readonly testModel: Model<Test>,
    private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<User[]> {
    const fetchedUsers = await this.userModel.find({});

    if (fetchedUsers.length === 0) {
      this.logger.error('Items not found');
      throw new HttpException('Items not found', HttpStatus.NOT_FOUND);
    }

    return fetchedUsers;
  }

  async findUserById(userId: findByIdDto): Promise<any> {
    const { id } = userId;

    const fetchedUser = await this.userModel.findById(id);

    this.logger.info('Fetched user:', fetchedUser);

    if (!fetchedUser) {
      this.logger.error('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const characteristics = Object.entries(
      fetchedUser?.tests
        .flatMap((elem) => elem.results.characteristics)
        .reduce((acc, current) => {
          if (acc[current?.characteristicId]) {
            acc[current?.characteristicId].push(current?.points);
          } else {
            acc[current?.characteristicId] = [current?.points];
          }
          return acc;
        }, {}),
    ).map((elem) => ({
      characteristicId: elem[0],
      points: (elem[1] as any[]).reduce((acc, current) => acc + current, 0),
    }));

    return { ...fetchedUser.toObject(), characteristics };
  }

  async update(
    userId: UpdateByIdDto,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { id } = userId;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    this.logger.info('Updated user:', updatedUser);

    if (!updatedUser) {
      this.logger.error('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  private isArrayEquals(a: any[], b: any[]) {
    if (a.length !== b.length) {
      return false;
    }

    const res = a.filter((elem) => b.includes(elem)).length;

    return res == a.length;
  }

  async addResults(
    body: AddResultsDto[],
    userId: string,
    testId: string,
  ): Promise<User> {
    const test = await this.testModel.findById(testId);

    const { passageTime } = body[0];
    const { questions } = test;

    const answerMap = body.reduce((acc, current) => {
      return { ...acc, [current.questionId]: current.answers };
    }, {});

    const characteristics = {};

    questions.forEach((question) => {
      const answer = answerMap[(question as any).questionId.toString()];

      if (!answer) {
        this.logger.info(`No answer found for question ID`);
        return;
      }

      const characteristic = question.characteristics[answer[0]];

      if (characteristics[characteristic.characteristicId.toString()]) {
        characteristics[characteristic.characteristicId.toString()] +=
          characteristic.points;
      } else {
        characteristics[characteristic.characteristicId.toString()] =
          characteristic.points;
      }
    });

    const characteristicArray = Object.entries(characteristics).map(
      (characteristic) => ({
        characteristicId: characteristic[0],
        points: characteristic[1],
      }),
    );

    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
      },
      {
        $push: {
          tests: {
            testId: new Types.ObjectId(testId),
            results: { characteristics: characteristicArray },
            passageTime,
            created_at: new Date(),
          },
        },
      },
      { new: true },
    );

    return updatedUser;
  }

  async addBelbinResults(
    result: Record<BelbinRole, number>,
    userId: string,
  ): Promise<User> {
    const testId = BELBIN_TEST_ID;
    const test = await this.testModel.findById(testId);

    if (!test) {
      throw new HttpException(
        `Test with ID ${testId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      {
        $push: {
          tests: {
            testId,
            type: 'belbin',
            results: result,
            created_at: new Date(),
          },
        },
      },
      { new: true },
    );

    return updatedUser;
  }
}
