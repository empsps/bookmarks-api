import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO, LoginDTO } from './dto';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDTO) {
    const { email, password, username } = dto;
    const hash = await argonHash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
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

  private isEmail(credential: string): boolean {
    return !!String(credential)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }

  async login(dto: LoginDTO) {
    const { credential, password } = dto;
    let user: User | null;

    switch (this.isEmail(credential)) {
      case true:
        user = await this.prisma.user.findUnique({
          where: {
            email: credential,
          },
        });
        break;

      case false:
        user = await this.prisma.user.findUnique({
          where: {
            username: credential,
          },
        });
        break;
    }

    if (!user) {
      throw new ForbiddenException('Incorrect login or password');
    }

    const passwordMatches = await argonVerify(user.hash, password);

    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect login of password');
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
