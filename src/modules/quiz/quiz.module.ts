import { Module } from '@nestjs/common';
import { TestService } from './quiz.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from 'src/database/models/test.schema';
import { TestController } from './quiz.controller';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Question, QuestionSchema } from 'src/database/models/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService, LoggerService],
})
export class TestModule {}
