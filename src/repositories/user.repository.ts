import { QueryFilter } from "mongoose";
import { User, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
  
  async findOneWithPassword(filter: QueryFilter<IUser>) {
    return await this.model.findOne(filter).select('+password').exec();
  }

}

export const userRepository = new UserRepository();