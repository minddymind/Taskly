// import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import Redis from 'ioredis'; // Redis setup

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

    // // Check cache first
    // const cacheKey = `tasks_upcoming_${ownerId}`;
    // const cachedTasks = await redis.get(cacheKey);

    // if (cachedTasks) {
    //   return new Response(cachedTasks, { status: 200 });
    // }

    // Set today's date to the start of the day (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Set tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Set the end date as 10 days from today
    const endDate = new Date(today);
    endDate.setUTCDate(endDate.getUTCDate() + 10);

    // Fetch upcoming tasks (tasks with deadlines within the next 10 days)
    const upcomingTasks = await prisma.toDo.findMany({
      where: {
        owner_id: ownerId,
        deadline: {
          gte: tomorrow, // starting from tomorrow
          lt: endDate,   // up to 10 days from today
        },
        isDeleted: false,
        progress_status: { not: 'completed' },
      },
    });

    // console.log('Tomorrow:', tomorrow);
    // console.log('End Date:', endDate);

    // Cache the results for 1 minute
    // await redis.set(cacheKey, JSON.stringify(upcomingTasks), 'EX', 60);

    return new Response(JSON.stringify({ upcomingTasks }), { status: 200 });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}
