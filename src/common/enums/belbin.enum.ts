import { Types } from 'mongoose';

export enum BelbinRole {
  implementer = 'implementer',
  coordinator = 'coordinator',
  creator = 'creator',
  generatorOfIdeas = 'generatorOfIdeas',
  researcher = 'researcher',
  expert = 'expert',
  diplomat = 'diplomat',
  specialist = 'specialist',
}

export const BELBIN_TEST_ID = new Types.ObjectId('677ffc10bc648d0df2743ff7');
