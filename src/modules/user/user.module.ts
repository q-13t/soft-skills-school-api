import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/models/user.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { Test } from '@nestjs/testing';
import { TestSchema } from 'src/database/models/test.schema';
import { BelbinService } from './belbin.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Test.name, schema: TestSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService, LoggerService, BelbinService, JwtService],
    exports: [MongooseModule],
})
export class UserModule { }
