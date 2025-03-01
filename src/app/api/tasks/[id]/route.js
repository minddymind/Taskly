// // pages/api/tasks/[id].js
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Redis from 'ioredis';

// const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

export async function PUT(req, { params }) {
  
  //protected route
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await params; // Extract the dynamic ID from the URL
  const body = await req.json(); // Parse the request body

  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const statusMapping = {
    to_do: "to_do",
    doing: "in_progress",
    done: "completed",
  };

  const mappedStatus = statusMapping[body.progress_status];
  if (!mappedStatus) {
    return NextResponse.json(
      { error: "Invalid progress_status value" },
      { status: 400 }
    );
  }

  try {

    // Fetch the task to find the owner before updating
    const task = await prisma.toDo.findUnique({
      where: { todo_id: parseInt(id) },
      select: { owner_id: true },
    });

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }

    // Update the task in the database
    const updatedTask = await prisma.toDo.update({
      where: { todo_id: parseInt(id) },
      data: {
        todo_title: body.todo_title,
        // todo_detail: body.todo_detail || null,
        progress_status: mappedStatus,
        updated_at: new Date(),
      },
    });

    // Clear the cache for the task's owner
    await redis.del(`tasks:${task.owner_id}`);

    // Clear the cache for today and upcoming tasks
    // await redis.del(`tasks_today_${task.owner_id}`);
    // await redis.del(`tasks_upcoming_${task.owner_id}`);

    // const ownerId = task.owner_id;
    // await updateTaskCache(ownerId, updatedTask);

    const todayCacheKey = `tasks_today_${task.owner_id}`;
    const upcomingCacheKey = `tasks_upcoming_${task.owner_id}`;

    // Fetch the current cached tasks
    const todayCache = await redis.get(todayCacheKey);
    const upcomingCache = await redis.get(upcomingCacheKey);

    // // If today tasks cache exists, update the relevant task in the cache
    // if (todayCache) {
    //   let todayTasks = JSON.parse(todayCache);
    //   todayTasks = todayTasks.map((task) =>
    //     task.todo_id === updatedTask.todo_id ? updatedTask : task
    //   );
    //   // Save updated tasks back to Redis cache
    //   await redis.set(todayCacheKey, JSON.stringify(todayTasks), 'EX', 60);  // Set expiration if needed
    // }

    // // If upcoming tasks cache exists, update the relevant task in the cache
    // if (upcomingCache) {
    //   let upcomingTasks = JSON.parse(upcomingCache);
    //   upcomingTasks = upcomingTasks.map((task) =>
    //     task.todo_id === updatedTask.todo_id ? updatedTask : task
    //   );
    //   // Save updated tasks back to Redis cache
    //   await redis.set(upcomingCacheKey, JSON.stringify(upcomingTasks), 'EX', 60);  // Set expiration if needed
    // }

    // If today tasks cache exists, update only the relevant task
    if (todayCache) {
      let todayTasks = JSON.parse(todayCache);

      todayTasks = todayTasks.map(t => 
        t.todo_id === updatedTask.todo_id ? { ...t, ...updatedTask } : t
      );

      // Save updated tasks back to Redis cache
      await redis.set(todayCacheKey, JSON.stringify(todayTasks), "EX", 300);
    }

    // If upcoming tasks cache exists, update only the relevant task
    if (upcomingCache) {
      let upcomingTasks = JSON.parse(upcomingCache);

      upcomingTasks = upcomingTasks.map(t => 
        t.todo_id === updatedTask.todo_id ? { ...t, ...updatedTask } : t
      );

      // Save updated tasks back to Redis cache
      await redis.set(upcomingCacheKey, JSON.stringify(upcomingTasks), "EX", 300);
    }

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.log('Error updating task:', error);
    return new Response(JSON.stringify({ message: 'Failed to update task' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  //protected route
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await params; // Extract the dynamic ID from the URL

  try {

    // Fetch the task to find the owner before deleting
    const task = await prisma.toDo.findUnique({
      where: { todo_id: parseInt(id) },
      select: { owner_id: true,
                progress_status: true,
                deadline: true,
                todo_id: true
       },
    });

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }

    const ownerId = task.owner_id;
    const cacheKey = `tasks:${ownerId}`;
    const todayCacheKey = `tasks_today_${ownerId}`;
    const upcomingCacheKey = `tasks_upcoming_${ownerId}`;

    // Delete the task in the database
    await prisma.toDo.update({
      where: { todo_id: parseInt(id) },
      data: { isDeleted: true },
    });

    // Clear the cache for the task's owner
    // await redis.del(`tasks:${task.owner_id}`);

    // Clear the cache for today and upcoming tasks
    // await redis.del(`tasks_today_${task.owner_id}`);
    // await redis.del(`tasks_upcoming_${task.owner_id}`);

    // Check if the cache keys exist before deleting them
    // const todayCacheKey = `tasks_today_${task.owner_id}`;
    // const upcomingCacheKey = `tasks_upcoming_${task.owner_id}`;

    // Remove task from general tasks cache (if it exists)
    const cachedTasks = await redis.get(cacheKey);
    if (cachedTasks) {
      // let tasksArray = JSON.parse(cachedTasks);
      // tasksArray = tasksArray.filter((t) => t.todo_id !== task.todo_id);
      // await redis.set(cacheKey, JSON.stringify(tasksArray), "EX", 60);
      const tasksArray = JSON.parse(cachedTasks).filter((t) => t.todo_id !== task.todo_id);
      await redis.set(cacheKey, JSON.stringify(tasksArray), "EX", 60);
    }

    // **Remove task from "today" or "upcoming" cache if applicable**
    if (task.progress_status !== "completed" && task.deadline) {
      const today = new Date();
      const taskDate = new Date(task.deadline);

      // Check if the task is for today
      const isToday = taskDate.toISOString().split("T")[0] === today.toISOString().split("T")[0];

      // Check if the task is upcoming (between tomorrow and the next 7 days)
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const isUpcoming = taskDate >= tomorrow && taskDate <= nextWeek;

      if (isToday) {
        const todayCache = await redis.get(todayCacheKey);
        if (todayCache) {
          let todayTasks = JSON.parse(todayCache);
          todayTasks = todayTasks.filter((t) => t.todo_id !== task.todo_id);
          await redis.set(todayCacheKey, JSON.stringify(todayTasks), "EX", 60);
        }
      }

      if (isUpcoming) {
        const upcomingCache = await redis.get(upcomingCacheKey);
        if (upcomingCache) {
          let upcomingTasks = JSON.parse(upcomingCache);
          upcomingTasks = upcomingTasks.filter((t) => t.todo_id !== task.todo_id);
          await redis.set(upcomingCacheKey, JSON.stringify(upcomingTasks), "EX", 60);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), { status: 200 });
  } catch (error) {
    console.log('Error deleting task:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete task' }), { status: 500 });
  }
}