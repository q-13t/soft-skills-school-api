import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'src/database/models/question.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import {
  Characteristic,
  CharacteristicSchema,
} from 'src/database/models/characteristic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Characteristic.name, schema: CharacteristicSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService, LoggerService],
})
export class QuestionModule {}
