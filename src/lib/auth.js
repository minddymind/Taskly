import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import db from "./db";
import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL);
const taskQueue = new Queue("taskQueue", { connection });

export const authOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login"
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                employeeId: { label: "Employee ID", type: "number", placeholder: "employee ID" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {

                // Check if the credentials are valid
                if (!credentials?.employeeId || !credentials?.password) {
                    // return null;
                    throw new Error("Missing credentials");
                }

                // Find user in the database
                const existingUser = await db.employee.findUnique({
                    where: { emp_id: parseInt(credentials.employeeId) }
                });

                if (!existingUser) {
                    // return null;
                    throw new Error("Invalid credentials");
                }

                // Check if the password is correct
                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    // return null;
                    throw new Error("Invalid credentials"); // Password mismatch
                }

                // If the user exists and the password is correct
                return {
                    emp_id: existingUser.emp_id,
                    acc_name: existingUser.acc_name
                };
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            // console.log("jwt", token, user);
            // if (user) {
            //     return { ...token, emp_id: user.emp_id, acc_name: user.acc_name };
            // }
            // return token;
            if (user) {
                token.emp_id = user.emp_id;
                token.acc_name = user.acc_name;

                // Preload tasks after login
                await taskQueue.add("preloadTasks", { userId: user.emp_id }, { removeOnComplete: true });
              }

            return token;
        },
        async session({session, token}) {
            // console.log("session", session, token);
            // return{
            //     ...session,
            //     user: { ...session.user, emp_id: token.emp_id, acc_name: token.acc_name }
            // }
            session.user = {
                emp_id: token.emp_id,
                acc_name: token.acc_name,
            };

            // if (token?.emp_id) {
            //     // Add BullMQ job to preload tasks when the session starts
            //     await taskQueue.add("preloadTasks", { userId: token.emp_id });
            //     console.log(`Added job to preload tasks for user ${token.emp_id}`);
            // }

            return session;
        },
    },
};

export default NextAuth(authOptions);