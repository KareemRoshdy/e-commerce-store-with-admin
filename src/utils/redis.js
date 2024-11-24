import Redis from "ioredis";
import { configDotenv } from "dotenv";

configDotenv();

const ridesClient = new Redis(process.env.APSTASH_REDIS_URL);

export { ridesClient };
