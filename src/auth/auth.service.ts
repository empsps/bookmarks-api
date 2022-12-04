import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { hash as argonHash, verify as argonVerify } from 'argon2';
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

  async login(dto: AuthDTO) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect username or password');
    }

    const passwordMatches = await argonVerify(user.hash, password);

    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect username of password');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
