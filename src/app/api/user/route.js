import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import * as z from "zod";

const prisma = new PrismaClient();

//Define a schema for validation
const userSchema = z.object({
    emp_id: z.number(),
    dept_name: z.string(),
    acc_name: z.string(),
    password: z.string()
});

export async function POST(request){
    try{
        const body = await request.json();
        const {emp_id,dept_name, acc_name,password} = userSchema.parse(body);

        //check if the user exists
        const existingUserById = await prisma.employee.findUnique({
            where: {emp_id: emp_id}
        });

        if(existingUserById){
            return NextResponse.json({user: null, message: "User already exists"},{status: 409});
        };

        //check if the account name exists
        const existingUserByAccName = await prisma.employee.findUnique({
            where: {acc_name: acc_name}
        });

        if(existingUserByAccName){
            return NextResponse.json({user: null, message: "Account name already exists"},{status: 409});
        };

        //check what department id is
        // const userDept = await prisma.department.findUnique({
        //     where: {department_id: dept_id},
        //     select: {department_id: true}
        // });

        //check if the department exists use rexex
        const partialMatches = await prisma.department.findMany({
            where: {
                department_name: { contains: dept_name, mode: "insensitive" }
            }
        });
        
        // Refine results using regex
        const regex = new RegExp(dept_name, "i");
        const userDept = partialMatches.find(department => regex.test(department.department_name));

        if (userDept) {
            console.log("Department exists:", userDept);
        } else {
            console.log("No matching department found. Creating a new department...");
            const newDept = await prisma.department.create({
                data: {
                    department_name: dept_name
                }
            });
            console.log("New department created:", newDept);
        };

        //hash the password
        const hashedPassword = await hash(password, 10);

        //store the user
        const newUser = await prisma.employee.create({
            data: {
                emp_id: emp_id,
                department_id: userDept.department_id,
                acc_name: acc_name,
                password: hashedPassword
            }
        });

        //remove the password from the response
        const {password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({user:rest, message: "User created successfully"},{status: 201});
    } catch(e){
        // return NextResponse.error(e);
        return NextResponse.json({message: "Something went wrong"},{status: 500});
    }
}

// export async function GET(){
//     return NextResponse.json({message: "Hello World"});
// }