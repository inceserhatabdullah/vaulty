import Redis from "ioredis";
import { redisConstant } from "../constants/redis.constant";

export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
    
    this.redis.on("error", (err) => {
      console.error(err);
    });
    
    this.redis.on("connect", () => {
      console.log("Redis connected");
    });
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async set(key: string, value: any, ttl: number = 0) {
    await this.redis.set(key, value);
    await this.redis.expire(key, ttl);
  }

  getBlackListedAccessTokenConstant(accessToken: string) {
    return `${redisConstant.blackListAccessToken}::${accessToken}`;
  }
}

export const redisService = new RedisService();
