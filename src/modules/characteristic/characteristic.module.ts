import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Characteristic,
  CharacteristicSchema,
} from 'src/database/models/characteristic.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import {
  SoftSkill,
  SoftSkillSchema,
} from 'src/database/models/soft-skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Characteristic.name, schema: CharacteristicSchema },
      { name: SoftSkill.name, schema: SoftSkillSchema },
    ]),
  ],
  providers: [CharacteristicService, LoggerService],
  controllers: [CharacteristicController],
})
export class CharacteristicModule {}
