-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "progressCurrent" INTEGER,
ADD COLUMN     "progressStep" TEXT,
ADD COLUMN     "progressTotal" INTEGER;
