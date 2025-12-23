import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Characteristic as CharacteristicDB } from 'src/database/models/characteristic.schema';
import { Characteristic } from 'src/types/characteristic.type';
import { CreateCharacteristicDto } from './dto/characteristic.dto';
import { SoftSkill as SoftSkillDB } from 'src/database/models/soft-skill.schema';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';

@Injectable()
export class CharacteristicService {
  constructor(
    @InjectModel(CharacteristicDB.name)
    private readonly characteristicModel: Model<CharacteristicDB>,
    @InjectModel(SoftSkillDB.name)
    private readonly softSkillModel: Model<SoftSkillDB>,
    private readonly logger: LoggerService,
  ) {}

  async create(
    createCharacteristicDto: CreateCharacteristicDto,
  ): Promise<Characteristic> {
    const newCharacteristic = new this.characteristicModel(
      createCharacteristicDto,
    );
    newCharacteristic.created_at = new Date();

    const savedCharacteristic = await newCharacteristic.save();

    return savedCharacteristic;
  }

  async getAll(): Promise<Characteristic[]> {
    const fetchedCharacteristics = await this.characteristicModel.find({});

    return fetchedCharacteristics;
  }

  async get(characteristicId: findByIdDto): Promise<Characteristic> {
    const { id } = characteristicId;

    const fetchedCharacteristic = await this.characteristicModel.findById(id);

    if (!fetchedCharacteristic) {
      this.logger.error('Characteristic not found');
      throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
    }

    return fetchedCharacteristic;
  }

  async delete(characteristicId: deleteByIdDto): Promise<Characteristic> {
    const { id } = characteristicId;

    const deletedCharacteristic =
      await this.characteristicModel.findByIdAndDelete(id);

    if (!deletedCharacteristic) {
      this.logger.error('Characteristic not found');
      throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
    }

    return deletedCharacteristic;
  }

  async deleteCharacteristicFromSoftSkill(
    characteristicId: string,
  ): Promise<void> {
    const fetchedSoftSkill = await this.softSkillModel.findOne({
      'characteristics.characteristicId': { $eq: characteristicId },
    });

    if (!fetchedSoftSkill) {
      this.logger.error('Soft skill not found');
      throw new HttpException('Soft skill not found', HttpStatus.NOT_FOUND);
    }

    await this.softSkillModel.updateMany(
      { _id: fetchedSoftSkill._id },
      { $pull: { characteristics: { characteristicId: characteristicId } } },
    );
  }
}
