import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CharacteristicService } from './characteristic.service';
import { CreateCharacteristicDto } from './dto/characteristic.dto';
import { Characteristic } from 'src/types/characteristic.type';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  CreateCharacteristicRequest,
  CreateCharacteristicResponse,
  DeleteCharacteristicResponse,
  GetAllCharacteristicsResponse,
  GetCharacteristicResponse,
} from './dto/characteristic-swagger.dto';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { isValidObjectId } from 'mongoose';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';

@ApiTags('Characteristic')
@Controller('characteristics')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add characteristic' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateCharacteristicRequest,
    description: 'JSON structure for characteristic',
  })
  @ApiResponse({
    type: CreateCharacteristicResponse,
    status: 201,
    description: 'The characteristic has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ObjectID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Soft skill not found',
  })
  async createCharacteristic(
    @Body()
    createCharacteristicDto: CreateCharacteristicDto,
  ): Promise<Characteristic> {
    const newCharacteristic = await this.characteristicService.create(
      createCharacteristicDto,
    );

    return newCharacteristic;
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all characteristics' })
  @ApiBearerAuth()
  @ApiResponse({
    type: [GetAllCharacteristicsResponse],
    status: 200,
    description: 'Characteristics successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Characteristics not found',
  })
  async getAllCharacteristics(): Promise<Characteristic[]> {
    const fetchedCharacteristics = await this.characteristicService.getAll();

    return fetchedCharacteristics;
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get characteristic' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetCharacteristicResponse,
    status: 200,
    description: 'The characteristic successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Characteristic not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ObjectID format in the path',
  })
  async getCharacteristic(
    @Param() characteristicId: findByIdDto,
  ): Promise<Characteristic> {
    if (!isValidObjectId(characteristicId)) {
      throw new HttpException(
        'Invalid ObjectID format in the path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fetchedCharacteristic = await this.characteristicService.get(
      characteristicId,
    );

    return fetchedCharacteristic;
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete characteristic' })
  @ApiBearerAuth()
  @ApiResponse({
    type: DeleteCharacteristicResponse,
    status: 200,
    description: 'Characteristic successfully deleted from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Characteristic not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ObjectID format in the path',
  })
  async deleteCharacteristic(
    @Param() characteristicId: deleteByIdDto,
  ): Promise<Characteristic> {
    if (!isValidObjectId(characteristicId)) {
      throw new HttpException(
        'Invalid ObjectID format in the path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedCharacteristic = await this.characteristicService.delete(
      characteristicId,
    );

    return deletedCharacteristic;
  }
}
