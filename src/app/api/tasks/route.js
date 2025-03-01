import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Redis from 'ioredis';

// const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  try {
    const body = await req.json();
    const { todo_title, todo_detail, progress_status, owner_id, deadline} = body;

    // Validate and normalize the progress_status
    // const validProgressStatuses = ['to_do', 'in_progress', 'completed'];
    // const normalizedStatus = validProgressStatuses.includes(progress_status)
    //   ? progress_status
    //   : 'to_do'; // Default to 'to_do' if invalid
    
    const statusMapping = {
      to_do: "to_do",
      doing: "in_progress",
      done: "completed",
    };
  
    const mappedStatus = statusMapping[progress_status];
    if (!mappedStatus) {
      return NextResponse.json(
        { error: "Invalid progress_status value" },
        { status: 400 }
      );
    }

    const ownerId = parseInt(owner_id);
    const cacheKey = `tasks:${ownerId}`;
    const todayCacheKey = `tasks_today_${ownerId}`;
    const upcomingCacheKey = `tasks_upcoming_${ownerId}`;

    const newTask = await prisma.toDo.create({
      data: {
        todo_title: todo_title,
        todo_detail: todo_detail || null,
        progress_status: mappedStatus, // Use normalized status
        owner_id: parseInt(owner_id),
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    // Update cache: Append newTask to cached tasks without refetching
    const cachedTasks = await redis.get(cacheKey);

    if (cachedTasks) {
      const tasksArray = JSON.parse(cachedTasks);
      tasksArray.push(newTask); // Append new task
      await redis.set(cacheKey, JSON.stringify(tasksArray), 'EX', 60); // Update cache
    } else {
      await redis.set(cacheKey, JSON.stringify([newTask]), 'EX', 60); // Set cache if empty
    }

    // **Update Today or Upcoming Cache**
    if (newTask.progress_status !== "completed" && newTask.deadline) {
      const today = new Date();
      const taskDate = new Date(newTask.deadline);

      // Check if the task is for today
      const isToday = taskDate.toISOString().split("T")[0] === today.toISOString().split("T")[0];

      // Check if the task is upcoming (between tomorrow and the next 7 days)
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const isUpcoming = taskDate >= tomorrow && taskDate <= nextWeek;

      if (isToday) {
        let todayTasks = await redis.get(todayCacheKey);
        todayTasks = todayTasks ? JSON.parse(todayTasks) : [];
        todayTasks.push(newTask);
        await redis.set(todayCacheKey, JSON.stringify(todayTasks), "EX", 60);
      }

      if (isUpcoming) {
        let upcomingTasks = await redis.get(upcomingCacheKey);
        upcomingTasks = upcomingTasks ? JSON.parse(upcomingTasks) : [];
        upcomingTasks.push(newTask);
        await redis.set(upcomingCacheKey, JSON.stringify(upcomingTasks), "EX", 60);
      }
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.log('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}