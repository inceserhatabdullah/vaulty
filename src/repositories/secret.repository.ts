import { BaseRepository } from "./base.repository";
import { ISecret, Secret } from "../models/secret.model";

export class SecretRepository extends BaseRepository<ISecret> {
  constructor() {
    super(Secret);
  }
}

export const secretRepository = new SecretRepository();
