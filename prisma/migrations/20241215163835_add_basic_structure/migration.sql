-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('to_do', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "Employee" (
    "emp_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "acc_name" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" SERIAL NOT NULL,
    "department_name" VARCHAR(100) NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "ToDo" (
    "todo_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "todo_title" TEXT NOT NULL,
    "todo_detail" TEXT,
    "progress_status" "ProgressStatus" NOT NULL DEFAULT 'to_do',
    "finish_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("todo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_acc_name_key" ON "Employee"("acc_name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_department_name_key" ON "Department"("department_name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;
