import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        tenant: { select: { id: true, name: true, slug: true, plan: true } },
      },
    });

    return NextResponse.json(fullUser);
  } catch (e) {
    console.error("GET /api/user error:", e);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const body = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/user error:", e);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
