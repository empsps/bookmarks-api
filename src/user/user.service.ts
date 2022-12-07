import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDTO) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('at least one field must be provided');
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }
}
