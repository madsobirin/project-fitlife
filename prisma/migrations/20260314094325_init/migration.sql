/*
  Warnings:

  - Changed the type of `target_status` on the `menus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('Kurus', 'Normal', 'Berlebih', 'Obesitas');

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "target_status",
ADD COLUMN     "target_status" "TargetStatus" NOT NULL;
