import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { hash as argonHash } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDTO) {
    const { email, password } = dto;
    const hash = await argonHash(password);

    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2002')) {
          throw new ForbiddenException('E-mail is already in use');
        }
      }
      throw error;
    }
  }

  login() {
    return 'Log in';
  }
}
