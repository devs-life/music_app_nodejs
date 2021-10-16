import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { ErrorResponse } from './types/reponse.types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(usersFilterQuery);
  }

  async create(user: User): Promise<any> {
    const newUser = new this.userModel(user);
    try {
      return newUser.save();
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      new: true,
    });
  }
}
