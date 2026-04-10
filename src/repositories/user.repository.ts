import { User, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
}

export const userRepository = new UserRepository();
