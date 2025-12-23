import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { Feedback } from 'src/types/feedback.type';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  DeleteFeedbackResponse,
  GetAllFeedbacksResponse,
  GetFeedbackResponse,
  UpdateFeedbackRequest,
  UpdateFeedbackResponse,
} from './dto/feedback-swagger.dto';

@ApiTags('Feedback')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add feedback' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateFeedbackRequest,
    description: 'JSON structure for feedback',
  })
  @ApiResponse({
    type: CreateFeedbackResponse,
    status: 201,
    description: 'The feedback has been successfully created',
  })
  async create(@Body() body: CreateFeedbackDto): Promise<Feedback> {
    return await this.feedbackService.create(body);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiBearerAuth()
  @ApiResponse({
    type: [GetAllFeedbacksResponse],
    status: 200,
    description: 'The feedbacks successfully retrieve from database',
  })
  async findAll() {
    return await this.feedbackService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get feedback' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetFeedbackResponse,
    status: 200,
    description: 'The feedback successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found',
  })
  async findOne(@Param('id') id: findByIdDto): Promise<Feedback> {
    return await this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update feedback' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateFeedbackRequest,
    description: 'JSON structure for feedback',
  })
  @ApiResponse({
    type: UpdateFeedbackResponse,
    status: 200,
    description: 'The feedback successfully updated',
  })
  update(
    @Param('id') id: findByIdDto,
    @Body() body: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiBearerAuth()
  @ApiResponse({
    type: DeleteFeedbackResponse,
    status: 200,
    description: 'The feedback successfully deleted from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found',
  })
  async remove(@Param('id') id: deleteByIdDto): Promise<Feedback> {
    return await this.feedbackService.remove(id);
  }
}
