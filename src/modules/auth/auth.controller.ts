import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { User } from '../users/schemas/user.schema';
import {
  ErrorResponse,
  LoginResponse,
  MessageResponse,
} from '../users/types/reponse.types';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signin')
  async loginUser(
    @Body('loginUserDto') loginUserDto: LoginUserDto,
  ): Promise<LoginResponse | ErrorResponse> {
    return this.usersService.loginUser(
      loginUserDto.email,
      loginUserDto.username,
      loginUserDto.password,
    );
  }

  @Post('signup')
  async createUser(
    @Body('createUserDto') createUserDto: CreateUserDto,
  ): Promise<MessageResponse> {
    return this.usersService.createUser(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
      createUserDto.name,
    );
  }
}
