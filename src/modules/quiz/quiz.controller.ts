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
import { TestService } from './quiz.service';
import { Test } from 'src/types/test.type';
import { CreateTestDto } from './dto/quiz.dto';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  CreateTestRequest,
  CreateTestResponse,
  DeleteTestResponse,
  GetAllTestsResponse,
  GetTestResponse,
} from './dto/quiz-swagger.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { isValidObjectId } from 'mongoose';
import { BELBIN_TEST_ID } from 'src/common/enums/belbin.enum';

@ApiTags('Test')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add test' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateTestRequest,
    description: 'JSON structure for test',
  })
  @ApiResponse({
    type: CreateTestResponse,
    status: 200,
    description: 'The test has been successfully created',
  })
  async createTest(@Body() createTestDto: CreateTestDto): Promise<Test> {
    const newTest = await this.testService.create(createTestDto);

    return newTest;
  }

  @Get()
  @HttpCode(201)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all tests' })
  @ApiBearerAuth()
  @ApiResponse({
    type: [GetAllTestsResponse],
    status: 201,
    description: 'The tests successfully retrieve from database',
  })
  async getTests(): Promise<Test[]> {
    const fetchedTests = await this.testService.getAll();

    return fetchedTests;
  }

  @Get('/belbin')
  @HttpCode(201)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get belbin test' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetTestResponse,
    status: 201,
    description: 'The test successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Test not found',
  })
  async getBelbinTest(): Promise<Test> {
    const fetchedTest = await this.testService.get(BELBIN_TEST_ID as any);

    return fetchedTest;
  }

  @Get(':id')
  @HttpCode(201)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get test' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetTestResponse,
    status: 201,
    description: 'The test successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Test not found',
  })
  async getTest(@Param() testId: findByIdDto): Promise<Test> {
    if (!isValidObjectId(testId)) {
      throw new HttpException(
        'Bad ObjectId format in the path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fetchedTest = await this.testService.get(testId);

    return fetchedTest;
  }

  @Delete(':id')
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete test' })
  @ApiBearerAuth()
  @ApiResponse({
    type: DeleteTestResponse,
    status: 201,
    description: 'The test successfully deleted from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Test not found',
  })
  async deleteTest(@Param() testId: deleteByIdDto): Promise<Test> {
    if (!isValidObjectId(testId)) {
      throw new HttpException(
        'Bad ObjectId format in the path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedTest = await this.testService.delete(testId);

    return deletedTest;
  }
}
