import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  signup(): string {
    return 'Register';
  }

  @Post('login')
  login(): string {
    return 'Log in';
  }
}
