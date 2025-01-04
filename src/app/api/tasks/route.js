import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

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
    const { todo_title, todo_detail, progress_status, owner_id } = body;

    // Validate and normalize the progress_status
    const validProgressStatuses = ['to_do', 'in_progress', 'completed'];
    const normalizedStatus = validProgressStatuses.includes(progress_status)
      ? progress_status
      : 'to_do'; // Default to 'to_do' if invalid

    const newTask = await prisma.toDo.create({
      data: {
        todo_title: todo_title,
        todo_detail: todo_detail || null,
        progress_status: normalizedStatus, // Use normalized status
        owner_id: parseInt(owner_id, 10),
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}