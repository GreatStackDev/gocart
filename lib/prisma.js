import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Force Neon to use WebSockets to avoid Next.js fetch bugs
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// Modern Prisma + Neon adapter configuration
const adapter = new PrismaNeon({ connectionString });

// Pass adapter unconditionally to satisfy Prisma's strict build requirements
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
