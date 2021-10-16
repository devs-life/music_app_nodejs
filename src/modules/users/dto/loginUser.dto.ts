import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsNotEmpty()
  password: string;
}
