import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser: SignUpDto = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'smith@gmail.com',
    password: 'qwerty',
    sex: 'Male',
    course: 2,
    direction: 'Design',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    it('should call sign up and return user', async () => {
      const result = await authService.signUp(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
