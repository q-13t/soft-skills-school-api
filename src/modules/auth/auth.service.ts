import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserDB, UserDocument } from 'src/database/models/user.schema';
import { User } from 'src/types/user.type';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { LoggerService } from 'src/common/helpers/winston.logger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserDB.name)
    private readonly userModel: Model<UserDB>,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;

    await this.findRegisteredEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel(signUpDto);
    user.password = hashedPassword;
    user.role = Role.USER;
    user.notifications = [];
    user.created_at = new Date();

    const newUser = await user.save();

    this.logger.info('Created user:', newUser);

    return newUser;
  }

  async findRegisteredEmail(email: string): Promise<void> {
    const fetchedUser = await this.userModel.findOne({ email });

    if (fetchedUser) {
      throw new HttpException(
        'This email is already registered',
        HttpStatus.CONFLICT,
      );
    }
  }

  async signIn(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const fetchedUser = await this.userModel.findOne({ email });

    if (!fetchedUser) {
      this.logger.error('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.logger.info('Found user:', fetchedUser);

    const comparedPassword = await bcrypt.compare(
      password,
      fetchedUser.password,
    );

    if (!comparedPassword) {
      this.logger.error('Incorrect email or password');
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let updatedUser = await this.addJwtToken(fetchedUser);

    updatedUser = await this.userModel.findOne({ email }).select('-password');

    return updatedUser;
  }

  async addJwtToken(user: UserDocument): Promise<User> {
    const { _id, email, role } = user;
    const payload = { sub: _id, email: email, role: role };

    const token = await this.jwtService.signAsync(payload);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id },
      { $set: { token: token } },
      { new: true },
    );

    this.logger.info('Updated user:', updatedUser);

    return updatedUser;
  }
}
