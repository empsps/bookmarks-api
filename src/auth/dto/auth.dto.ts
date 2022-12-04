import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

class LoginDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  credential: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export { RegisterDTO, LoginDTO };
