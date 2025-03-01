import { Worker } from "bullmq";
import Redis from "ioredis";
import prisma from "@/lib/prisma";

const connection = new Redis(process.env.REDIS_URL);
const redisClient = new Redis(process.env.REDIS_URL);

const worker = new Worker(
  "taskQueue",
  async (job) => {
    const { userId } = job.data;
    console.log(`Fetching tasks for user ${userId}...`);

    // Fetch department members
    const userDept = await prisma.employee.findUnique({
      where: { emp_id: userId },
      select: {
        department: {
          select: {
            department_id: true,
          },
        },
      },
    });

    if (!userDept) {
      console.error(`User ${userId} not found`);
      return;
    }

    const members = await prisma.employee.findMany({
      where: { department_id: userDept.department.department_id },
      select: { emp_id: true },
    });

    const memberIds = members.map((member) => member.emp_id);

    // Fetch tasks for department members
    const tasks = await prisma.toDo.findMany({
      where: {
        owner_id: { in: memberIds },
        isDeleted: false,
      },
    });

    // Store in Redis for faster retrieval
    await redisClient.set(`tasks:${userId}`, JSON.stringify(tasks), "EX", 300);
    console.log(`Cached tasks for user ${userId}`);
  },
  { connection }
);
