// // pages/api/tasks/[id].js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Redis from 'ioredis';

const prisma = new PrismaClient();
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
      select: { owner_id: true },
    });

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }

    // Delete the task in the database
    await prisma.toDo.update({
      where: { todo_id: parseInt(id) },
      data: { isDeleted: true },
    });

    // Clear the cache for the task's owner
    await redis.del(`tasks:${task.owner_id}`);

    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), { status: 200 });
  } catch (error) {
    console.log('Error deleting task:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete task' }), { status: 500 });
  }
}