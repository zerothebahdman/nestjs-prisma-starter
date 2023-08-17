import type { User } from '@prisma/client';

export class UserResponse {
  id: string;

  username: string;

  email: string;

  emailVerified: boolean;

  name: string;

  avatar: string | null;

  birthDate: Date | null; // ISO Date

  createdAt: Date; // ISO Date

  updatedAt: Date; // ISO Date

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.username = entity.username;
    response.email = entity.email;
    response.emailVerified = entity.emailVerified;
    response.name = [entity.firstName, entity.middleName, entity.lastName]
      .filter((s) => s !== null)
      .join(' ');
    response.avatar = entity.avatar;
    response.birthDate = entity.birthDate;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
