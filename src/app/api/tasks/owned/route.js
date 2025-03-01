// import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Redis from 'ioredis';

// const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const ownerId = parseInt(searchParams.get('ownerId'));

    if (isNaN(ownerId)) {
      return new Response(JSON.stringify({ error: 'Invalid owner ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cacheKey = `tasks:${ownerId}`;
    const cachedTasks = await redis.get(cacheKey);

    if (cachedTasks){
      console.log("Serving from cache...");
      return new Response(cachedTasks, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userDept = await prisma.employee.findUnique({
      where: { emp_id: ownerId },
      select: {
        department: {
          select: {
            department_id: true,
          },
        },
      },
    });

    if (!userDept) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const members = await prisma.employee.findMany({
      where: {
        department_id: userDept.department.department_id,
      },
      select: {
        emp_id: true,
      },
    });

    const memberIds = members.map((member) => member.emp_id);

    const tasks = await prisma.toDo.findMany({
      where: {
        owner_id: {
          in: memberIds,
        },
        isDeleted: false, // Fetch only non-deleted tasks
      },
    });

    await redis.set(cacheKey, JSON.stringify(tasks), 'EX', 60); // Cache for 5 minutes

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}