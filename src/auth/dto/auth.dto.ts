import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export { AuthDTO };
