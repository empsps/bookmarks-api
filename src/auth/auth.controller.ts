import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDTO) {
    return this.service.register(dto);
  }

  @Post('login')
  login(): string {
    return this.service.login();
  }
}
