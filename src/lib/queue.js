import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL);

// Create a queue for updating task statuses
export const taskQueue = new Queue("taskQueue", { connection });
