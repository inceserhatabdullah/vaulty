import { Model, QueryFilter, UpdateQuery, UpdateWriteOpResult } from "mongoose";

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

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const created = await this.model.insertMany(data);
    return created.map((doc: any) => doc.toObject()) as T[];
  }

  async update(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async updateMany(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update).exec();
  }

  async delete(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  async deleteMany(filter: QueryFilter<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  async softDelete(filter: QueryFilter<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, { isDeleted: true }, { new: true })
      .exec();
  }

  async softDeleteMany(filter: QueryFilter<T>): Promise<any> {
    return this.model.updateMany(filter, { isDeleted: true }).exec();
  }
}
