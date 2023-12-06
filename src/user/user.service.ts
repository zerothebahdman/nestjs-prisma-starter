import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { AuthUser } from '../auth/auth-user';
import { UpdateUserRequestDto } from './models';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserEntityById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async getUserEntityByUsername(
    username: string,
  ): Promise<AuthUser | null> {
    const normalizedUsername = username.toLowerCase();
    return this.prisma.user.findUnique({
      where: { username: normalizedUsername },
    });
  }

  async updateUser(userId: string, updateRequest: UpdateUserRequestDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...updateRequest,
          birth_date:
            updateRequest.birth_date !== null &&
            updateRequest.birth_date !== undefined
              ? new Date(updateRequest.birth_date)
              : updateRequest.birth_date,
        },
      });

      return updatedUser;
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new ConflictException();
    }
  }

  async queryUserDetails(filter: { [key: string]: string }) {
    return await this.prisma.user.findFirst({
      where: filter,
    });
  }
}
