import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      // expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token,
    };
  }
}
