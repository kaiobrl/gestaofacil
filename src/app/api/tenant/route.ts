import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: { id: true, name: true, slug: true, plan: true },
    });

    return NextResponse.json(tenant);
  } catch (e) {
    console.error("GET /api/tenant error:", e);
    return NextResponse.json({ error: "Erro ao buscar empresa" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const body = await req.json();

    if (!body.name || body.name.trim().length < 1) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const tenant = await prisma.tenant.update({
      where: { id: user.tenantId },
      data: { name: body.name },
      select: { id: true, name: true, slug: true, plan: true },
    });

    return NextResponse.json(tenant);
  } catch (e) {
    console.error("PATCH /api/tenant error:", e);
    return NextResponse.json({ error: "Erro ao atualizar empresa" }, { status: 500 });
  }
}
