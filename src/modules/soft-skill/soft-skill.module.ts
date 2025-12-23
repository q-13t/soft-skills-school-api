import { Module } from '@nestjs/common';
import { SoftSkillService } from './soft-skill.service';
import { SoftSkillController } from './soft-skill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SoftSkill,
  SoftSkillSchema,
} from 'src/database/models/soft-skill.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import {
  Characteristic,
  CharacteristicSchema,
} from 'src/database/models/characteristic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SoftSkill.name, schema: SoftSkillSchema },
      { name: Characteristic.name, schema: CharacteristicSchema },
    ]),
  ],
  providers: [SoftSkillService, LoggerService],
  controllers: [SoftSkillController],
})
export class SoftSkillModule {}
