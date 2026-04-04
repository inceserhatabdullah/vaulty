import { Token, IToken } from "../models/token.model";
import { BaseRepository } from "./base.repository";

export class TokenRepository extends BaseRepository<IToken> {
  constructor() {
    super(Token);
  }
}

export const tokenRepository = new TokenRepository();
