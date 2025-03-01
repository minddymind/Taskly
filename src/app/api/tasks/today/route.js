// import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import Redis from 'ioredis'; // Redis setup
// import { json } from 'stream/consumers';

// const prisma = new PrismaClient();
// const redis = new Redis(process.env.REDIS_URL);

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const ownerId = parseInt(searchParams.get('ownerId'));

    if (isNaN(ownerId)) {
      return new Response(JSON.stringify({ error: "Invalid owner ID" }), { status: 400 });
    }

    // Check cache first
    // const cacheKey = `tasks_today_${ownerId}`;
    // const cachedTasks = await redis.get(cacheKey);

    // if (cachedTasks) {
    //   return new Response(cachedTasks, { status: 200 });
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch tasks for today
    const todayTasks = await prisma.toDo.findMany({
      where: {
        owner_id: ownerId,
        deadline: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
        progress_status: { not: 'completed' },
      },
    });

    // console.log('Today:', today);
    // console.log('Tomorrow:', tomorrow);

    // Cache the results for 1 minute
    // await redis.set(cacheKey, JSON.stringify(todayTasks), 'EX', 60);

    return new Response(JSON.stringify({ todayTasks }), { status: 200 });
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}