import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// FIX: We DELETE `neonConfig.poolQueryViaFetch = true` entirely.
// This forces Neon to use WebSockets, completely avoiding Next.js 'fetch' bugs!
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// Pass adapter unconditionally to satisfy Prisma's strict build requirements
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
