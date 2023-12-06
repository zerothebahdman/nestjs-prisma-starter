import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    Logger.log(`🚀 connected to db successfully`, 'DATABASE');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    Logger.log(`🚀 disconnected from db successfully`, 'DATABASE');
  }
}
