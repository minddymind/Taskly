import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
      });
  }

  try {
      const body = await req.json();
      console.log("Request Body:", body); // Debugging log

      const { taskId, progress_status } = body;

      // Check if required fields exist
      if (!taskId || !progress_status) {
          return new Response(JSON.stringify({ error: "Missing required fields", received: body }), { status: 400 });
      }

      const updatedTask = await prisma.toDo.update({
          where: { todo_id: taskId },
          data: { progress_status: progress_status, finish_at: new Date() },
      });

      const ownerId = updatedTask.owner_id;
      const cacheKey = `tasks:${ownerId}`;
      const todayCacheKey = `tasks_today:${ownerId}`;
      const upcomingCacheKey = `tasks_upcoming:${ownerId}`;

      // Get the cached tasks
      const cachedTasks = await redis.get(cacheKey);

      if (cachedTasks) {
        let tasksArray = JSON.parse(cachedTasks);

        // Check if the task is already in the cache
        const taskIndex = tasksArray.findIndex((task) => task.todo_id === taskId);

        if (taskIndex !== -1) {
          // If task is found, update its progress_status
          tasksArray[taskIndex].progress_status = progress_status;

          // Update the specific task in the cache
          await redis.set(cacheKey, JSON.stringify(tasksArray), "EX", 60);
        } else {
          // If task not found in cache, add it (this is rare since the task might not exist)
          tasksArray.push(updatedTask);

          // Store updated tasks back in Redis
          await redis.set(cacheKey, JSON.stringify(tasksArray), "EX", 60);
        }
      } else {
        // If no tasks are in cache, just add the updated task to the cache
        await redis.set(cacheKey, JSON.stringify([updatedTask]), "EX", 60);
      }

      // Check if task is in tasks_today or tasks_upcoming cache and delete it
      const todayCache = await redis.get(todayCacheKey);
      if (todayCache) {
        let todayTasks = JSON.parse(todayCache);
        const taskIndexToday = todayTasks.findIndex((t) => String(t.todo_id) === String(taskId));
        
        if (taskIndexToday !== -1) {
          // Hard delete the task from today cache
          todayTasks.splice(taskIndexToday, 1);
          await redis.set(todayCacheKey, JSON.stringify(todayTasks), "EX", 60);
        }
      }

      const upcomingCache = await redis.get(upcomingCacheKey);
      if (upcomingCache) {
        let upcomingTasks = JSON.parse(upcomingCache);
        const taskIndexUpcoming = upcomingTasks.findIndex((t) => String(t.todo_id) === String(taskId));

        if (taskIndexUpcoming !== -1) {
          // Hard delete the task from upcoming cache
          upcomingTasks.splice(taskIndexUpcoming, 1);
          await redis.set(upcomingCacheKey, JSON.stringify(upcomingTasks), "EX", 60);
        }
      }

      return new Response(JSON.stringify({ updatedTask }), { status: 200 });
  } catch (error) {
      console.error("API Error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to update task" }), { status: 500 });
  }
}
  