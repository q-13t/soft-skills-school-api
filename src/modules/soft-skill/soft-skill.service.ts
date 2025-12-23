import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, isValidObjectId } from 'mongoose';
import {
  SoftSkill as SoftSkillDB,
  SoftSkillDocument,
} from 'src/database/models/soft-skill.schema';
import { CreateSoftSkillDto, UpdateSoftSkillDto } from './dto/soft-skill.dto';
import { SoftSkill } from 'src/types/soft-skill.type';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { UpdateByIdDto } from 'src/common/dto/updateById.dto';
import {
  Characteristic as CharacteristicDB,
  CharacteristicDocument,
} from 'src/database/models/characteristic.schema';

@Injectable()
export class SoftSkillService {
  constructor(
    @InjectModel(SoftSkillDB.name)
    private readonly softSkillModel: Model<SoftSkillDB>,
    @InjectModel(CharacteristicDB.name)
    private readonly characteristicModel: Model<CharacteristicDB>,
    private readonly logger: LoggerService,
  ) {}

  async create(createSoftSkillDto: CreateSoftSkillDto): Promise<SoftSkill> {
    const { type, characteristics, description, functionality } =
      createSoftSkillDto;

    let characteristicIds: ObjectId[] = [];

    if (characteristics && characteristics.length > 0) {
      characteristicIds = characteristics.map(
        (characteristic) => characteristic.characteristicId,
      );
    }

    const fetchedCharacteristics: CharacteristicDocument[] =
      await this.findCharacteristicsById(characteristicIds);

    if (fetchedCharacteristics.length !== characteristicIds.length) {
      const missingCharacteristicIds = characteristicIds.filter(
        (charId: any) =>
          !fetchedCharacteristics.some((char) => char._id.equals(charId)),
      );

      this.logger.error(
        `Characteristics not found: ${missingCharacteristicIds.join(', ')}`,
      );
      throw new HttpException(
        'Some characteristics not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const softSkill = new this.softSkillModel({
      type,
      characteristics,
      description,
      functionality,
    });
    softSkill.created_at = new Date();

    const newSoftSkill = await softSkill.save();

    await this.addSoftSkillForCharacteristic(newSoftSkill, characteristicIds);

    return newSoftSkill;
  }

  async findCharacteristicsById(
    characteristicIds: ObjectId[],
  ): Promise<CharacteristicDocument[]> {
    const fetchedCharacteristics = await this.characteristicModel.find({
      _id: { $in: characteristicIds },
    });

    return fetchedCharacteristics;
  }

  async addSoftSkillForCharacteristic(
    softSkill: SoftSkillDocument,
    characteristicIds: ObjectId[],
  ): Promise<void> {
    await this.characteristicModel.updateMany(
      {
        _id: { $in: characteristicIds },
      },
      {
        $set: {
          'softSkill.softSkillId': softSkill.id,
          'softSkill.type': softSkill.type,
        },
      },
    );
  }

  async getAll(): Promise<SoftSkill[]> {
    const fetchedSoftSkills = await this.softSkillModel.find({});

    if (fetchedSoftSkills.length === 0) {
      this.logger.error('Soft skills not found');
      throw new HttpException('Soft skills not found', HttpStatus.NOT_FOUND);
    }

    return fetchedSoftSkills;
  }

  async get(softSkillId: findByIdDto): Promise<SoftSkill> {
    const { id } = softSkillId;

    const fetchedSoftSkill = await this.softSkillModel.findById(id);

    this.logger.info('Fetched soft skill:', fetchedSoftSkill);

    if (!fetchedSoftSkill) {
      this.logger.error('Soft skill not found');
      throw new HttpException('Soft skill not found', HttpStatus.NOT_FOUND);
    }

    return fetchedSoftSkill;
  }

  async delete(softSkillId: deleteByIdDto): Promise<SoftSkill> {
    const { id } = softSkillId;

    const deletedSoftSkill = await this.softSkillModel.findByIdAndDelete(id);

    this.logger.info('Deleted soft skill:', deletedSoftSkill);

    if (!deletedSoftSkill) {
      this.logger.error('Soft skill not found');
      throw new HttpException('Soft skill not found', HttpStatus.NOT_FOUND);
    }

    return deletedSoftSkill;
  }

  async update(
    softSkillId: UpdateByIdDto,
    updateSoftSkillDto: UpdateSoftSkillDto,
  ): Promise<SoftSkill> {
    const { id } = softSkillId;
    const { type, characteristics } = updateSoftSkillDto;

    const updatedSoftSkill = await this.softSkillModel.findByIdAndUpdate(
      id,
      { type, characteristics },
      { new: true },
    );

    if (!updatedSoftSkill) {
      this.logger.error('Soft skill not found');
      throw new HttpException('Soft skill not found', HttpStatus.NOT_FOUND);
    }

    await this.updateCharacteristicBasedOnSoftSkill(id, type);

    return updatedSoftSkill;
  }

  async updateCharacteristicBasedOnSoftSkill(
    softSkillId: string,
    updatedType: string,
  ): Promise<void> {
    if (!isValidObjectId(softSkillId)) {
      this.logger.error('Invalid ObjectId format');
      throw new HttpException(
        'Invalid ObjectId format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedCharacteristic = await this.characteristicModel.updateMany(
      { 'softSkill.softSkillId': { $eq: softSkillId } },
      { $set: { 'softSkill.type': updatedType } },
    );

    this.logger.info(
      `Updated ${updatedCharacteristic.modifiedCount} characteristics for soft skill with ID:`,
      softSkillId,
    );
  }
}
