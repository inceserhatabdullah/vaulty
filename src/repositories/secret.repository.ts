import { BaseRepository } from "./base.repository";
import { ISecret, Secret } from "../models/secret.model";

export class SecretRepository extends BaseRepository<ISecret> {
  constructor() {
    super(Secret);
  }

  async find(request: { userId: string }): Promise<any[]> {
    return this.aggregate([
      { $match: { userId: request.userId } },
      {
        $project: {
          title: 1,
          category: 1,
          key: 1,
          value: {
            $cond: {
              if: { $eq: ["$encrypted", false] },
              then: "$value",
              else: "$$REMOVE",
            },
          },
        },
      },
    ]);
  }
}

export const secretRepository = new SecretRepository();
