import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import {
  ErrorResponse,
  LoginResponse,
  MessageResponse,
} from './types/reponse.types';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  // to get user by id
  async getUserById(userId: string): Promise<User> {
    return await this.usersRepository.findOne({ userId });
  }

  // to get all the users in the database
  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  // creating the user
  async createUser(
    email: string,
    username: string,
    password: string,
    name: string,
  ): Promise<MessageResponse> {
    //checking if the email and username already exist
    const userWithEmail = await this.usersRepository.findOne({ email });
    if (userWithEmail) {
      throw new BadRequestException('user with the email already exists.');
    }

    const userWithUsername = await this.usersRepository.findOne({
      username: username,
    });
    if (userWithUsername) {
      throw new BadRequestException('user with the username already exists.');
    }

    // generating salt for encryption
    const salt = await bcrypt.genSalt();

    // hashing password
    const encryptedPassword = await this.hashPassword(password, salt);

    // saving the user
    let date = `${new Date()}`;
    date = date.split('GMT')[0];

    await this.usersRepository.create({
      name: name,
      email: email,
      username: username,
      profilePictureUrl: 'NA',
      encryptedPassword: encryptedPassword,
      salt: salt,
      createdAt: date,
      updatedAt: null,
    });

    return {
      statusCode: 201,
      message: 'user created successfully.',
    };
  }

  // authenticating the user
  async loginUser(
    email: string,
    username: string,
    password: string,
  ): Promise<LoginResponse | ErrorResponse> {
    let user: User;

    if (email) user = await this.usersRepository.findOne({ email: email });
    if (username)
      user = await this.usersRepository.findOne({ username: username });

    // getting the user

    if (user) {
      // if correct password
      // creating payload
      const payload = {
        name: user.name,
        email: user.email,
        username: user.username,
      };

      // generating accessToken
      const accessToken = await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '120d',
      });

      // hashing the password
      const hash = await bcrypt.hash(password, user.salt);
      if (user.encryptedPassword === hash) {
        return {
          statusCode: 200,
          message: 'correct password!',
          data: {
            userData: {
              name: user.name,
              email: user.email,
              username: user.username,
            },
            accessToken: accessToken,
          },
        };
      }
      // incorrect password
      throw new BadRequestException('Wrong Password!');
    } else {
      // id user doesn't exists
      throw new BadRequestException('user doesnt exists.');
    }
  }

  // helper method to hash the user password
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
