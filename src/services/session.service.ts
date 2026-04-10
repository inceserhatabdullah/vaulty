import { QueryFilter } from "mongoose";
import { ISession } from "../models/session.model";
import {
  sessionRepository,
  SessionRepository,
} from "../repositories/session.repository";

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(session: Partial<ISession>): Promise<void> {
    await this.sessionRepository.create(session);
  }

  async findOne(
    filter: QueryFilter<ISession>,
    select: string = "",
  ): Promise<ISession | null> {
    return this.sessionRepository.findOne(filter, select);
  }

  async update(
    filter: QueryFilter<ISession>,
    update: Partial<ISession>,
  ): Promise<void> {
    await this.sessionRepository.update(filter, update);
  }
  
  async softDelete(filter: QueryFilter<ISession>): Promise<void> {
    await this.sessionRepository.softDelete(filter);
  }
  
  async softDeleteMany(filter: QueryFilter<ISession>): Promise<void> {
    await this.sessionRepository.softDeleteMany(filter);
  }
}

export const sessionService = new SessionService(sessionRepository);
