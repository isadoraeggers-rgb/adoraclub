import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// prisma.config.ts resolves DATABASE_URL relative to the project root (cwd);
// mirror that here since the adapter resolves relative paths itself.
const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbFile = rawUrl.replace(/^file:/, "");
const absoluteDbFile = path.isAbsolute(dbFile)
  ? dbFile
  : path.join(/* turbopackIgnore: true */ process.cwd(), dbFile);

const adapter = new PrismaBetterSqlite3({ url: `file:${absoluteDbFile}` });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
