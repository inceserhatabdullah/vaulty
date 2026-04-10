import { Session, ISession } from "../models/session.model";
import { BaseRepository } from "./base.repository";

export class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(Session);
  }
}

export const sessionRepository = new SessionRepository();
