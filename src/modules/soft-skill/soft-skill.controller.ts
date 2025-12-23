import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import { SoftSkillService } from './soft-skill.service';
import { CreateSoftSkillDto, UpdateSoftSkillDto } from './dto/soft-skill.dto';
import { SoftSkill } from 'src/types/soft-skill.type';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  CreateSoftSkillRequest,
  CreateSoftSkillResponse,
  DeleteSoftSkillResponse,
  GetAllSoftSkillsResponse,
  GetSoftSkillResponse,
  UpdateSoftSkillRequest,
  UpdateSoftSkillResponse,
} from './dto/soft-skill-swagger.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { UpdateByIdDto } from 'src/common/dto/updateById.dto';
import { isValidObjectId } from 'mongoose';

@ApiTags('Soft Skill')
@Controller('soft-skills')
export class SoftSkillController {
  constructor(private readonly softSkillService: SoftSkillService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add soft skill' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateSoftSkillRequest,
    description: 'JSON structure for soft skill',
  })
  @ApiResponse({
    type: CreateSoftSkillResponse,
    status: 201,
    description: 'The soft skill has been successfully created',
  })
  async createSoftSkill(
    @Body() createSoftSkillDto: CreateSoftSkillDto,
  ): Promise<SoftSkill> {
    const newSoftSkill = await this.softSkillService.create(createSoftSkillDto);

    return newSoftSkill;
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all soft skills' })
  @ApiBearerAuth()
  @ApiResponse({
    type: [GetAllSoftSkillsResponse],
    status: 200,
    description: 'Soft skills successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Soft skills not found',
  })
  async getAllSoftSkills(): Promise<SoftSkill[]> {
    const fetchedSoftSkills = await this.softSkillService.getAll();

    return fetchedSoftSkills;
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get soft skill' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetSoftSkillResponse,
    status: 201,
    description: 'The soft skill has been successfully created',
  })
  @ApiResponse({
    status: 404,
    description: 'Soft skill not found',
  })
  async getSoftSkill(@Param() softSkillId: findByIdDto): Promise<SoftSkill> {
    const fetchedSoftSkill = await this.softSkillService.get(softSkillId);

    return fetchedSoftSkill;
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete soft skill' })
  @ApiBearerAuth()
  @ApiResponse({
    type: DeleteSoftSkillResponse,
    status: 200,
    description: 'Soft skill successfully deleted from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Soft skill not found',
  })
  async deleteSoftSkill(
    @Param() softSkillId: deleteByIdDto,
  ): Promise<SoftSkill> {
    const deletedSoftSkill = await this.softSkillService.delete(softSkillId);

    return deletedSoftSkill;
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update soft skill' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateSoftSkillRequest,
    description: 'JSON structure for update soft skill',
  })
  @ApiResponse({
    type: UpdateSoftSkillResponse,
    status: 200,
    description: 'The soft skill successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Soft skill not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ObjectID format in the path',
  })
  async updateSoftSkill(
    @Param() softSkillId: UpdateByIdDto,
    @Body() updateSoftSkillDto: UpdateSoftSkillDto,
  ): Promise<SoftSkill> {
    if (!isValidObjectId(softSkillId)) {
      throw new HttpException(
        'Invalid ObjectID format in the path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedSoftSkill = await this.softSkillService.update(
      softSkillId,
      updateSoftSkillDto,
    );

    return updatedSoftSkill;
  }
}
