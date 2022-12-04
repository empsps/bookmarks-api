import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { hash as argonHash } from 'argon2';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDTO): Promise<User> {
    const { email, password } = dto;
    const hash = await argonHash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });
    return user;
  }

  login(): string {
    return 'Log in';
  }
}
