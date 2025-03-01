/*
  Warnings:

  - Added the required column `deadline` to the `ToDo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToDo" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
