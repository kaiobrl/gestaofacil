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
    } catch (error: any) {
      checks.database = `erro: ${error.message}`;
    }

    try {
      const userCount = await prisma.user.count();
      checks.users = `${userCount} usuários`;
    } catch (error: any) {
      checks.users = `tabela não existe: ${error.code}`;
    }
  }

  return NextResponse.json(checks);
}
