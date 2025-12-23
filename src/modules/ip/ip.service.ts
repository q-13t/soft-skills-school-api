import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ip } from 'src/database/models/ip.schema';

@Injectable()
export class IpService {
  constructor(@InjectModel(Ip.name) private ipModel: Model<Ip>) {}

  async isBlocked(ip: string): Promise<boolean> {
    const record = await this.ipModel.findOne({ ip });
    return record ? record.requestCount >= 5 : false;
  }

  async blockIp(ip: string): Promise<void> {
    const ttl = 10;
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const record = await this.ipModel.findOne({ ip });

    if (record) {
      record.requestCount += 1;
      await record.save();
    } else {
      const newIp = new this.ipModel({ ip, requestCount: 1, expiresAt });
      await newIp.save();
    }
  }
}
