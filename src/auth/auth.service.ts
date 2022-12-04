import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { hash as argonHash } from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDTO) {
    const { email, password } = dto;
    const hash = await argonHash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  login() {
    return 'Log in';
  }
}
