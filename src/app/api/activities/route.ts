import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createActivitySchema, updateActivitySchema } from "@/lib/validations/activity";

export async function GET(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { tenantId: user.tenantId };
    if (type) where.type = type;
    if (status === "pending") where.completed = false;
    if (status === "completed") where.completed = true;

    const activities = await prisma.activity.findMany({
      where,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ activities });
  } catch (e) {
    console.error("GET /api/activities error:", e);
    return NextResponse.json({ error: "Erro ao buscar atividades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const result = createActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        ...result.data,
      },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (e) {
    console.error("POST /api/activities error:", e);
    return NextResponse.json({ error: "Erro ao criar atividade" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const result = updateActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, ...data } = result.data;

    const activity = await prisma.activity.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!activity) {
      return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.completed !== undefined) {
      updateData.completedAt = data.completed ? new Date() : null;
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/activities error:", e);
    return NextResponse.json({ error: "Erro ao atualizar atividade" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const activity = await prisma.activity.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!activity) {
      return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 });
    }

    await prisma.activity.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/activities error:", e);
    return NextResponse.json({ error: "Erro ao excluir atividade" }, { status: 500 });
  }
}
