import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { QuestionModule } from './modules/question/question.module';
import { TestModule } from './modules/quiz/quiz.module';
import { SoftSkillModule } from './modules/soft-skill/soft-skill.module';
import { CharacteristicModule } from './modules/characteristic/characteristic.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { UploadModule } from './modules/upload/upload.module';
import { SeedModule } from './seed/seed.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URL),
        AuthModule,
        UserModule,
        QuestionModule,
        TestModule,
        SoftSkillModule,
        CharacteristicModule,
        NotificationModule,
        FeedbackModule,
        UploadModule,
        SeedModule,
    ],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule { }
