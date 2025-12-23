import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/types/user.type';
import { AuthDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
} from './dto/auth-swagger.dto';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from 'src/common/guards/throttle.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user account' })
  @ApiBody({
    type: SignUpRequest,
    description: 'JSON structure for user',
  })
  @ApiResponse({
    type: SignUpResponse,
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({ status: 409, description: 'This email is already registered' })
  @HttpCode(201)
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    const user = await this.authService.signUp(signUpDto);

    return user;
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  // @UseGuards(CustomThrottlerGuard)
  @Post('/signin')
  @ApiOperation({
    summary:
      'Allows registered users to authenticate and obtain an access token',
  })
  @ApiBody({
    type: SignInRequest,
    description: 'JSON structure for user sign in',
  })
  @ApiResponse({
    type: AuthDto,
    status: 200,
    description: 'The user has successfully logged in',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect email or password',
  })
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto): Promise<User> {
    const user = await this.authService.signIn(signInDto);

    return user;
  }
}
