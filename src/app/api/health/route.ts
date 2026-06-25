import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL ? "configurada" : "MISSING";
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? "configurada" : "MISSING";
  checks.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "MISSING";

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "conectado";
    } catch (error) {
      checks.database = `erro: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    try {
      const userCount = await prisma.user.count();
      checks.users = `${userCount} usuários`;
    } catch (error) {
      checks.users = `tabela não existe: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }

  return NextResponse.json(checks);
}
