import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return new Response(
        JSON.stringify({ message: "Not authenticated" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        emp_id: token.emp_id,
        acc_name: token.acc_name,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
