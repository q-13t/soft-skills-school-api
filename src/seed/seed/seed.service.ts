import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/user-role.enum';
import { User, UserDocument } from 'src/database/models/user.schema';
import { loggers } from 'winston';
@Injectable()
export class SeedService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async run() {
        const adminUser = await this.userModel.findOne({ email: 'admin@itstep.org' });
        if (adminUser) {
            console.log('Admin user already exists.');
            return;
        }

        const users = [
            {
                firstName: 'Admin',
                lastName: 'Admin',
                email: 'admin@itstep.org',
                password: bcrypt.hashSync('1qaz!QAZ', 10),
                sex: 'Male',
                course: 2,
                direction: 'Design',
                role: Role.ADMIN,
                created_at: new Date(),
            },
        ];

        await this.userModel.insertMany(users);
    }
}
