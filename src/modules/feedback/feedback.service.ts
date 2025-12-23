import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { Feedback as FeedbackDB } from 'src/database/models/feedback.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/database/models/user.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Feedback } from 'src/types/feedback.type';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(FeedbackDB.name)
    private readonly feedbackModel: Model<FeedbackDB>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: LoggerService,
  ) {}

  async create(body: CreateFeedbackDto): Promise<Feedback> {
    const { testId } = body;

    const feedback = new this.feedbackModel({
      ...body,
      created_at: new Date(),
    });

    await this.addFeedbackToTest(testId, feedback);

    const createdFeedback = await feedback.save();

    return createdFeedback;
  }

  async addFeedbackToTest(testId: string, feedback: Feedback): Promise<any> {
    const objectId = new Types.ObjectId(testId);

    const updatedTest = await this.userModel.findOneAndUpdate(
      { 'tests._id': objectId },
      { $set: { 'tests.$.feedback': feedback } },
      { new: true },
    );

    if (!updatedTest) {
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }

    return updatedTest;
  }

  async findAll(): Promise<Feedback[]> {
    const feedbacks = await this.feedbackModel.find({});

    return feedbacks;
  }

  async findOne(feedbackId: findByIdDto): Promise<Feedback> {
    const { id } = feedbackId;

    const feedback = await this.feedbackModel.findById(id);

    if (!feedback) {
      throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
    }

    return feedback;
  }

  async update(feedbackId: findByIdDto, body: UpdateFeedbackDto) {
    const { id } = feedbackId;

    const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(
      id,
      body,
      { new: true },
    );

    if (!updatedFeedback) {
      throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
    }

    return updatedFeedback;
  }

  async remove(feedbackId: deleteByIdDto): Promise<Feedback> {
    const { id } = feedbackId;

    const deletedFeedback = await this.feedbackModel.findByIdAndDelete(id);

    if (!deletedFeedback) {
      throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
    }

    return deletedFeedback;
  }
}
