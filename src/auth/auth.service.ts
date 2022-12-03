import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  register(): string {
    return 'Register';
  }

  login(): string {
    return 'Log in';
  }
}
