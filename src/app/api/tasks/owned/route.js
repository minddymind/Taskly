import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

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
    const ownerId = parseInt(searchParams.get('ownerId'), 10);

    if (isNaN(ownerId)) {
      return new Response(JSON.stringify({ error: 'Invalid owner ID' }), {
        status: 400,
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