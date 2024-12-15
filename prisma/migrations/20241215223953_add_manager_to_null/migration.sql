-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_manager_id_fkey";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "manager_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Employee"("emp_id") ON DELETE SET NULL ON UPDATE CASCADE;
