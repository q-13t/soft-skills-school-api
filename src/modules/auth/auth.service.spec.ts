import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from 'src/database/models/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('authService', () => {
  let authService: AuthService;
  let model: Model<User>;

  const mockUser: SignUpDto = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'smith@gmail.com',
    password: 'qwerty',
    sex: 'Male',
    course: 2,
    direction: 'Design',
  };

  const mockUserModel = jest.fn().mockImplementation((dto) => {
    return {
      save: () => Promise.resolve({ id: 1, created_at: new Date(), ...dto }),
      ...dto,
    };
  });

  const mockAuthService = {
    save: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 1, created_at: new Date(), ...mockUser }),
      ),
    findOne: jest
      .fn()
      .mockImplementationOnce((email) => Promise.resolve(email)),
    userModel: jest.fn().mockImplementation((dto) => {
      return {
        save: () => Promise.resolve({ id: 1, created_at: new Date(), ...dto }),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        LoggerService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('signUp', () => {
    it('should create and return user', async () => {
      await mockAuthService.findOne(mockUser.email);
      const result = await authService.signUp(mockUser);

      expect(result).toEqual({ id: 1, created_at: new Date(), ...mockUser });
    });

    it('should throw HttpException if email is already registered', async () => {
      try {
        await authService.signUp(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('This email is already registered');
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });
  });
});
