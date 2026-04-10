import { QueryFilter } from "mongoose";
import { IUser } from "../models/user.model";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: Partial<IUser>) {
    return await this.userRepository.create(user);
  }

  async findOne(filter: QueryFilter<IUser>, select: string = "") {
    return await this.userRepository.findOne(filter, select);
  }
}

export const userService = new UserService(userRepository);
