-- AlterTable
ALTER TABLE "post" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "post_id_seq";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "user_id_seq";
