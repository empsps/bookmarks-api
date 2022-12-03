import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  register(): string {
    return 'Register';
  }

  login(): string {
    return 'Log in';
  }
}
