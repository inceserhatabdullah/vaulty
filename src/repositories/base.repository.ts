import { Model, QueryFilter, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async find(filter: QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject() as T;
  }

  async update(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async delete(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }
}
