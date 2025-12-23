import { Module } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { UserModule } from 'src/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { BelbinService } from 'src/modules/user/belbin.service';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true, }),
        MongooseModule.forRoot(process.env.MONGO_URL),
    ],
    providers: [SeedService, UserService, LoggerService, BelbinService],
})
export class SeedModule { }
